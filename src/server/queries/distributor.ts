import { ipcMain, IpcMainEvent } from 'electron';
import log from 'electron-log';
import db from '../database';

ipcMain.on('db-find-publisher-distributor-map', async (event: IpcMainEvent) => {
  const results = await db
    .select('publisher', 'distributor')
    .from('publisher_distributor');

  const books = await db.distinct('publisher').from('books');

  const map: Record<string, string | null> = {};

  books.forEach(({ publisher }) => {
    map[publisher] = null;
  });

  results.forEach(({ publisher, distributor }) => {
    map[publisher] = distributor;
  });

  event.reply('db-find-publisher-distributor-map-result', map);
});

ipcMain.on(
  'db-update-publisher-distributor-map',
  async (event: IpcMainEvent, publisher: string, distributor: string) => {
    try {
      await db('publisher_distributor')
        .insert({ publisher, distributor })
        .onConflict('publisher')
        .merge();
      event.reply('db-update-publisher-distributor-map-result', true);
    } catch (e) {
      log.error(
        'Error updating publisher distributor map.',
        'publisher =',
        publisher,
        'distributor =',
        distributor,
        'error =',
        e
      );
      event.reply('db-update-publisher-distributor-map-result', false);
    }
  }
);

ipcMain.on('db-find-distributors', async (event: IpcMainEvent) => {
  const result = await db.distinct('distributor').from('publisher_distributor');

  const distributors = result
    .map(({ distributor }) => distributor)
    .filter((v) => v);

  event.reply('db-find-distributors-result', distributors);
});

ipcMain.on(
  'db-distributor-list-export-books',
  async (event: IpcMainEvent, distributor: string) => {
    const result = await db
      .select(
        'books.isbn',
        'books.name',
        'books.publisher',
        'books.type',
        'books.schoolYear',
        'books.codePe',
        db.raw(
          'SUM(orders_books.target_quantity - orders_books.ordered_quantity) as quantity'
        )
      )
      .from('books')
      .leftJoin('orders_books', 'books.isbn', 'orders_books.isbn')
      .leftJoin(
        'publisher_distributor',
        'books.publisher',
        'publisher_distributor.publisher'
      )
      .where('publisher_distributor.distributor', distributor)
      .andWhere(
        'orders_books.ordered_quantity',
        '<',
        'orders_books.target_quantity'
      )
      .groupBy('books.isbn');

    event.reply(
      'db-distributor-list-export-books-result',
      result.filter((product) => product.quantity > 0)
    );
  }
);

ipcMain.on(
  'db-distributor-export-books',
  async (event: IpcMainEvent, products: string[]) => {
    let count;
    try {
      count = await db.transaction(async (trx) => {
        await Promise.all(
          products.map(async (isbn) => {
            const ordersBooks = await trx
              .select(
                'orders_books.id as id',
                'orders_books.target_quantity as targetQuantity',
                'orders_books.ordered_quantity as orderedQuantity'
              )
              .from('orders_books')
              .leftJoin('books', 'orders_books.isbn', 'books.isbn')
              .whereNot(
                'orders_books.target_quantity',
                'orders_books.ordered_quantity'
              )
              .andWhere('books.isbn', isbn);

            await Promise.all(
              ordersBooks.map(async (order) => {
                const toOrder = order.targetQuantity - order.orderedQuantity;

                await trx('orders_books')
                  .update({ ordered_quantity: order.targetQuantity })
                  .where('id', order.id);

                await trx
                  .insert({
                    orders_books_id: order.id,
                    timestamp: trx.fn.now(),
                    quantity: toOrder,
                    type: 'ordered',
                  })
                  .into('orders_books_history');
              })
            );
          })
        );

        return products.length;
      });
    } catch (e) {
      log.error(e);
      count = -1;
    }

    event.reply('db-distributor-export-books-result', count);
  }
);

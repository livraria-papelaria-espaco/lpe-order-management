import { Knex } from 'knex';
import { ipcMain, IpcMainEvent, dialog } from 'electron';
import log from 'electron-log';
import xlsx from 'xlsx';
import { BookWithQuantity } from '../../types/database';
import db from '../database';
import { registerListener } from '../ipcWrapper';

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
              .whereNot(
                'orders_books.target_quantity',
                trx.ref('orders_books.ordered_quantity')
              )
              .andWhere('orders_books.isbn', isbn);

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

const createPortoEditoraExport = (
  filePath: string,
  books: BookWithQuantity[]
) => {
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.aoa_to_sheet([
    ['QT', 'CDPE'],
    ...books.map((book) => [book.quantity, book.codePe]),
  ]);
  xlsx.utils.book_append_sheet(wb, ws);

  xlsx.writeFile(wb, filePath);
};

ipcMain.on(
  'save-custom-distributor-excel',
  async (
    event: IpcMainEvent,
    distributor: string,
    books: BookWithQuantity[]
  ) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: 'porto-editora.xlsx',
    });

    if (!filePath || canceled) {
      event.reply('save-custom-distributor-excel-result', false);
      return;
    }

    if (distributor === 'porto-editora') {
      createPortoEditoraExport(filePath, books);
    }

    event.reply('save-custom-distributor-excel-result', true);
  }
);

const recalculateOrderStatus = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trx: Knex.Transaction<any, any[]>,
  id: number
) => {
  const [order] = await trx.select('status').from('orders').where('id', id);
  if (order.status !== 'pending') return;

  const orderBooks = await trx
    .select('id')
    .from('orders_books')
    .whereNot('target_quantity', trx.ref('available_quantity'))
    .andWhere('order_id', id);

  if (orderBooks.length > 0) return;

  await trx('orders').update({ status: 'ready' }).where('id', id);
};

registerListener(
  'db-distributor-import-books',
  async (books: BookWithQuantity[]) => {
    const modifiedOrderIds = new Set<number>();
    await db.transaction(async (trx) => {
      await Promise.all(
        books.map(async ({ isbn, quantity }) => {
          let remainingQuantity = quantity;

          const orderBooks = await trx
            .select(
              'orders_books.id as id',
              'orders_books.ordered_quantity as orderedQuantity',
              'orders_books.available_quantity as availableQuantity',
              'orders.id as orderId'
            )
            .from('orders_books')
            .leftJoin('orders', 'orders_books.order_id', 'orders.id')
            .whereNot(
              'orders_books.ordered_quantity',
              trx.ref('orders_books.available_quantity')
            )
            .andWhere('orders_books.isbn', isbn)
            .orderBy('orders.created_at', 'asc');

          await Promise.all(
            orderBooks.map(
              async ({ id, orderedQuantity, availableQuantity, orderId }) => {
                modifiedOrderIds.add(orderId);

                const toAdd = Math.min(
                  remainingQuantity,
                  orderedQuantity - availableQuantity
                );
                remainingQuantity -= toAdd;

                if (toAdd !== 0) {
                  await trx('orders_books')
                    .update({ available_quantity: availableQuantity + toAdd })
                    .where('id', id);

                  await trx
                    .insert({
                      orders_books_id: id,
                      timestamp: trx.fn.now(),
                      quantity: toAdd,
                      type: 'arrived',
                    })
                    .into('orders_books_history');
                }
              }
            )
          );

          if (remainingQuantity > 0) {
            const [book] = await trx
              .select('stock')
              .from('books')
              .where('isbn', isbn);
            await trx('books')
              .update({ stock: book.stock + remainingQuantity })
              .where('isbn', isbn);
          }
        })
      );
      await Promise.all(
        [...modifiedOrderIds].map((id) => recalculateOrderStatus(trx, id))
      );
    });
    return true;
  }
);

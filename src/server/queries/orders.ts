import { ipcMain, IpcMainEvent } from 'electron';
import log from 'electron-log';
import db from '../database';

ipcMain.on(
  'db-create-order',
  async (
    event: IpcMainEvent,
    customerId: number,
    books: Record<string, number>,
    notes: string
  ) => {
    try {
      const id = await db.transaction(async (trx) => {
        const [orderId] = await trx
          .insert({
            created_at: db.fn.now(),
            updated_at: db.fn.now(),
            customer_id: customerId,
            status: 'pending',
            notes,
          })
          .into('orders');

        await Promise.all(
          Object.entries(books).map(async ([isbn, quantity]) => {
            const bookResult = await trx
              .select('stock')
              .from('books')
              .where('isbn', isbn)
              .limit(1);

            if (bookResult.length === 0)
              throw new Error('Book with provided ISBN does not exist');

            const { stock } = bookResult[0];

            const availableQuantity = Math.min(stock, quantity);

            if (stock !== 0) {
              await trx('books')
                .update({ stock: stock - availableQuantity })
                .where('isbn', isbn);
            }

            await trx
              .insert({
                order_id: orderId,
                isbn,
                target_quantity: quantity,
                available_quantity: availableQuantity,
                ordered_quantity: 0,
                pickedup_quantity: 0,
              })
              .into('orders_books');
          })
        );

        return orderId;
      });

      event.reply('db-create-order-result', id);
    } catch (e) {
      log.error('Failed to create order', e);
      event.reply('db-create-order-result', false);
    }
  }
);

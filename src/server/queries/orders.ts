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

            const [orderBookId] = await trx
              .insert({
                order_id: orderId,
                isbn,
                target_quantity: quantity,
                available_quantity: availableQuantity,
                ordered_quantity: availableQuantity,
                pickedup_quantity: 0,
              })
              .into('orders_books');

            if (stock !== 0) {
              await trx('books')
                .update({ stock: stock - availableQuantity })
                .where('isbn', isbn);

              await trx
                .insert({
                  orders_books_id: orderBookId,
                  timestamp: db.fn.now(),
                  quantity: availableQuantity,
                  type: 'from_stock',
                })
                .into('orders_books_history');
            }
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

ipcMain.on('db-orders-find', async (event: IpcMainEvent) => {
  const result = await db
    .select(
      'orders.id as orderId',
      'status',
      'notes',
      'orders.created_at',
      'orders.updated_at',
      'customers.id as customerId',
      'customers.name as customerName'
    )
    .orderBy('orders.created_at', 'desc')
    .leftJoin('customers', 'orders.customer_id', 'customers.id')
    .from('orders');

  const orders = await Promise.all(
    result.map(async (v) => ({
      id: v.orderId,
      customer: {
        id: v.customerId,
        name: v.customerName,
      },
      status: v.status,
      created_at: v.created_at,
      updated_at: v.updated_at,
      notes: v.notes,
      books: [
        ...(await db
          .select(
            'id',
            'isbn',
            'target_quantity as targetQuantity',
            'ordered_quantity as orderedQuantity',
            'available_quantity as availableQuantity',
            'pickedup_quantity as pickedupQuantity'
          )
          .where('order_id', v.orderId)
          .from('orders_books')),
      ],
    }))
  );

  event.reply('db-result-orders-find', orders);
});

ipcMain.on('db-order-find-one', async (event: IpcMainEvent, id: number) => {
  try {
    const result = await db
      .select(
        'orders.id as orderId',
        'status',
        'notes',
        'orders.created_at',
        'orders.updated_at',
        'customers.id as customerId',
        'customers.name as customerName',
        'customers.phone as customerPhone',
        'customers.email as customerEmail'
      )
      .orderBy('orders.created_at', 'desc')
      .leftJoin('customers', 'orders.customer_id', 'customers.id')
      .where('orders.id', id)
      .from('orders');

    const orderBooks = await db
      .select(
        'id',
        'books.isbn as isbn',
        'target_quantity as targetQuantity',
        'ordered_quantity as orderedQuantity',
        'available_quantity as availableQuantity',
        'pickedup_quantity as pickedupQuantity',
        'name',
        'publisher',
        'provider',
        'type',
        'schoolYear',
        'codePe',
        'stock'
      )
      .where('order_id', result[0].orderId)
      .leftJoin('books', 'orders_books.isbn', 'books.isbn')
      .from('orders_books');

    const order = {
      id: result[0].orderId,
      customer: {
        id: result[0].customerId,
        name: result[0].customerName,
        phone: result[0].customerPhone,
        email: result[0].customerEmail,
      },
      status: result[0].status,
      created_at: result[0].created_at,
      updated_at: result[0].updated_at,
      notes: result[0].notes,
      books: await Promise.all(
        orderBooks.map(async (orderBook) => ({
          ...orderBook,
          history: [
            ...(await db
              .select('id', 'timestamp', 'quantity', 'type')
              .where('orders_books_id', orderBook.id)
              .from('orders_books_history')),
          ],
        }))
      ),
    };

    event.reply('db-result-order-find-one', order);
  } catch (e) {
    log.error('Failed to find an order by ID', e);
    event.reply('db-result-order-find-one', false);
  }
});

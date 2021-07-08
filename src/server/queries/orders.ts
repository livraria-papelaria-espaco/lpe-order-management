import { ipcMain, IpcMainEvent } from 'electron';
import log from 'electron-log';
import { Knex } from 'knex';
import { FetchOrdersParams, Order } from '../../types/database';
import db from '../database';
import { registerListener } from '../ipcWrapper';

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

registerListener('db-orders-find', async (params: FetchOrdersParams) => {
  let query = db
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

  if (params?.status) query = query.where('orders.status', params?.status);

  const result = await query;

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

  return orders;
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

registerListener('db-order-next-status', async (orderId: number) => {
  const [order] = await db.select('status').from('orders').where('id', orderId);
  const { status } = order;
  let newStatus;
  if (status === 'ready') newStatus = 'notified';

  if (!newStatus) return false;
  await db('orders').update({ status: newStatus }).where('id', orderId);
  return newStatus;
});

const recalculateOrderStatus = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trx: Knex.Transaction<any, any[]>,
  id: number
) => {
  const orderBooks = await trx
    .select('id')
    .from('orders_books')
    .whereNot('target_quantity', trx.ref('pickedup_quantity'))
    .andWhere('order_id', id);

  if (orderBooks.length > 0) return;

  await trx('orders').update({ status: 'finished' }).where('id', id);
};

registerListener(
  'db-order-pick-up',
  async (orderId: number, bookMap: Record<string, number>) => {
    await db.transaction(async (trx) => {
      await Promise.all(
        Object.entries(bookMap).map(async ([isbn, quantity]) => {
          if (quantity === 0) return;

          const [
            { id, availableQuantity, pickedupQuantity },
          ] = await trx
            .select(
              'id',
              'id',
              'available_quantity as availableQuantity',
              'pickedup_quantity as pickedupQuantity'
            )
            .from('orders_books')
            .where('isbn', isbn)
            .andWhere('order_id', orderId);

          if (availableQuantity - pickedupQuantity < quantity)
            throw new Error(
              `Tried to pickup more quantity than available (${
                availableQuantity - pickedupQuantity
              } < ${quantity}). Order ${orderId}. ISBN ${isbn}`
            );

          await trx('orders_books')
            .update({ pickedup_quantity: pickedupQuantity + quantity })
            .where('id', id);

          await trx
            .insert({
              orders_books_id: id,
              timestamp: trx.fn.now(),
              quantity,
              type: 'pickedup',
            })
            .into('orders_books_history');
        })
      );
      await recalculateOrderStatus(trx, orderId);
    });
    return true;
  }
);

registerListener(
  'db-orders-count-by-status',
  async () => {
    const result = await db
      .select('status')
      .count('id', { as: 'count' })
      .from('orders')
      .groupBy('status');

    return result.reduce(
      (acc, { status, count }) => ({ ...acc, [status]: count }),
      {}
    );
  },
  null
);

registerListener('db-orders-update', async ({ id, ...data }: Order) => {
  await db('orders').update(data).where('id', id);
  return true;
});

import {
  Book,
  BookWithQuantity,
  FetchOrdersParams,
  Order,
  OrderStatus,
} from '../types/database';

const { ipcRenderer } = require('electron');

let requestId = 0;

export const fetchFromIpc = <T>(channel: string, ...args: unknown[]) =>
  new Promise<T>((resolve) => {
    const id = requestId++;
    ipcRenderer.once(`${channel}-result-${id}`, (_: unknown, result: T) =>
      resolve(result)
    );

    ipcRenderer.send(channel, id, ...args);
  });

/* books.ts */

export const findAllBooks = () => fetchFromIpc<Book[]>('db-books-find');

export const insertOrGetBooks = (books: Book[]) =>
  fetchFromIpc<Book[]>('db-books-insert-or-get', books);

/* distributor.ts */

export const importBooksDistributor = (books: BookWithQuantity[]) =>
  fetchFromIpc<boolean>('db-distributor-import-books', books);

/* orderImports.ts */

export const importFromWook = () =>
  fetchFromIpc<string[] | false>('order-import-wook-open');

export const parseImportFromWook = (wookIds: string[]) =>
  fetchFromIpc<Book[]>('order-import-wook-parse', wookIds);

/* orders.ts */

export const fetchOrders = (params?: FetchOrdersParams) =>
  fetchFromIpc<Order[]>('db-orders-find', params);

export const moveOrderToNextStatus = (orderId: number) =>
  fetchFromIpc<OrderStatus | false>('db-order-next-status', orderId);

export const pickupProducts = (
  orderId: number,
  bookMap: Record<string, number>
) => fetchFromIpc<boolean>('db-order-pick-up', orderId, bookMap);

export const getOrdersCountByStatus = () =>
  fetchFromIpc<Record<OrderStatus, string> | null>('db-orders-count-by-status');

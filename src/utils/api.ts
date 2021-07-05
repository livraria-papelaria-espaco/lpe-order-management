import { Book, BookWithQuantity } from '../types/database';

const { ipcRenderer } = require('electron');

export const fetchFromIpc = <T>(channel: string, ...args: unknown[]) =>
  new Promise<T>((resolve) => {
    ipcRenderer.once(`${channel}-result`, (_: unknown, result: T) =>
      resolve(result)
    );

    ipcRenderer.send(channel, ...args);
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

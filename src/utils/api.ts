import { Book } from '../types/database';

const { ipcRenderer } = require('electron');

export const fetchFromIpc = <T>(channel: string, ...args: unknown[]) =>
  new Promise<T>((resolve) => {
    ipcRenderer.once(`${channel}-result`, (_: unknown, result: T) =>
      resolve(result)
    );

    ipcRenderer.send(channel, ...args);
  });

/* orderImports.ts */

export const importFromWook = () =>
  fetchFromIpc<string[] | false>('order-import-wook-open');

export const parseImportFromWook = (wookIds: string[]) =>
  fetchFromIpc<Book[]>('order-import-wook-parse', wookIds);

/* books.ts */

export const insertOrGetBooks = (books: Book[]) =>
  fetchFromIpc<Book[]>('db-books-insert-or-get', books);

import { ipcMain, IpcMainEvent } from 'electron';
import db from '../database';
import getBookMetadata from '../../utils/bookMetadata';

ipcMain.on('db-books-find', async (event: IpcMainEvent) => {
  const result = await db
    .select('isbn', 'name', 'publisher', 'type', 'stock')
    .orderBy('updated_at', 'desc')
    .from('books');
  event.reply('db-result-books-find', result);
});

type BookInsertArgs = {
  isbn: string;
  name: string;
  publisher: string;
  provider: string;
  type: 'manual' | 'ca' | 'other';
  schoolYear: string;
  codePe: string;
  stock: string;
};

ipcMain.on(
  'db-books-insert',
  async (event: IpcMainEvent, args: BookInsertArgs) => {
    try {
      const result = await db
        .insert({
          created_at: db.fn.now(),
          updated_at: db.fn.now(),
          ...args,
          stock: parseInt(args.stock, 10) || 0,
          schoolYear: parseInt(args.schoolYear, 10) || null,
        })
        .into('books');
      event.reply('db-result-books-insert', result);
    } catch (e) {
      event.reply('db-result-books-insert', false);
    }
  }
);

ipcMain.on('db-book-find-one', async (event: IpcMainEvent, isbn: string) => {
  try {
    const bookData = await db
      .select(
        'isbn',
        'name',
        'publisher',
        'provider',
        'type',
        'schoolYear',
        'codePe',
        'stock',
        'created_at',
        'updated_at'
      )
      .where('isbn', isbn)
      .from('books');
    event.reply('db-result-book-find-one', { book: bookData[0] });
  } catch (e) {
    event.reply('db-result-book-find-one', false);
  }
});

ipcMain.on(
  'db-book-update',
  async (event: IpcMainEvent, args: BookInsertArgs) => {
    try {
      await db('books').where('isbn', args.isbn).update({
        name: args.name,
        publisher: args.publisher,
        provider: args.provider,
        type: args.type,
        schoolYear: args.schoolYear,
        codePe: args.codePe,
        stock: args.stock,
        updated_at: db.fn.now(),
      });
      event.reply('db-result-book-update', true);
    } catch (e) {
      event.reply('db-result-book-update', false);
    }
  }
);

ipcMain.on('db-book-delete', async (event: IpcMainEvent, isbn: string) => {
  try {
    await db('books').where('isbn', isbn).del();
    event.reply('db-result-book-delete', true);
  } catch (e) {
    event.reply('db-result-book-delete', false);
  }
});

ipcMain.on(
  'utils-book-get-metadata',
  async (event: IpcMainEvent, isbn: string) => {
    try {
      event.reply(
        'utils-result-book-get-metadata',
        await getBookMetadata(isbn)
      );
    } catch (e) {
      event.reply('utils-result-book-get-metadata', false);
    }
  }
);

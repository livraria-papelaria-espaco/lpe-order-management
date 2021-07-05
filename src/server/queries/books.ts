import { ipcMain, IpcMainEvent } from 'electron';
import log from 'electron-log';
import { Book } from '../../types/database';
import getBookMetadata from '../../utils/bookMetadata';
import db from '../database';

ipcMain.on('db-books-find', async (event: IpcMainEvent) => {
  const result = await db
    .select('isbn', 'name', 'publisher', 'type', 'stock', 'codePe')
    .orderBy('updated_at', 'desc')
    .from('books');
  event.reply('db-books-find-result', result);
});

type BookInsertArgs = Book & {
  schoolYear: string;
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
          isbn: args.isbn,
          name: args.name || '',
          publisher: args.publisher || '',
          type: args.type || '',
          codePe: args.codePe || '',
          stock: parseInt(args.stock, 10) || 0,
          schoolYear: parseInt(args.schoolYear, 10) || null,
        })
        .into('books');
      event.reply('db-result-books-insert', result);
    } catch (e) {
      log.error('Failed to insert book', e);
      event.reply('db-result-books-insert', false);
    }
  }
);

ipcMain.on(
  'db-books-insert-or-get',
  async (event: IpcMainEvent, args: Book[]) => {
    try {
      const books = await db.transaction(async (trx) => {
        return Promise.all(
          args.map(async (book) => {
            const result = await trx
              .select(
                'isbn',
                'name',
                'publisher',
                'type',
                'schoolYear',
                'codePe',
                'stock',
                'created_at',
                'updated_at'
              )
              .where('isbn', book?.isbn)
              .from('books');
            if (result.length === 0) {
              await trx
                .insert({
                  created_at: db.fn.now(),
                  updated_at: db.fn.now(),
                  isbn: book.isbn,
                  name: book.name || '',
                  publisher: book.publisher || '',
                  type: book.type || '',
                  codePe: book.codePe || '',
                  stock: book.stock || 0,
                  schoolYear: book.schoolYear || null,
                })
                .into('books');
              return book;
            }
            return result[0];
          })
        );
      });
      event.reply('db-books-insert-or-get-result', books);
    } catch (e) {
      log.error(e);
      event.reply('db-books-insert-or-get-result', false);
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
    log.error('Failed to find a book by ISBN', e);
    event.reply('db-result-book-find-one', false);
  }
});

ipcMain.on(
  'db-book-update',
  async (event: IpcMainEvent, args: BookInsertArgs) => {
    try {
      await db('books')
        .where('isbn', args.isbn)
        .update({
          name: args.name,
          publisher: args.publisher,
          type: args.type,
          codePe: args.codePe,
          stock: parseInt(args.stock, 10) || 0,
          schoolYear: parseInt(args.schoolYear, 10) || null,
          updated_at: db.fn.now(),
        });
      event.reply('db-result-book-update', true);
    } catch (e) {
      log.error('Failed to update book', e);
      event.reply('db-result-book-update', false);
    }
  }
);

ipcMain.on('db-book-delete', async (event: IpcMainEvent, isbn: string) => {
  try {
    await db('books').where('isbn', isbn).del();
    event.reply('db-result-book-delete', true);
  } catch (e) {
    log.error('Failed to delete book', e);
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
      log.error('Failed to get metadata of book by ISBN', e);
      event.reply('utils-result-book-get-metadata', false);
    }
  }
);

import { ipcMain, IpcMainEvent } from 'electron';
import log from 'electron-log';
import { Book } from '../../types/database';
import getBookMetadata from '../../utils/bookMetadata';
import db from '../database';
import { registerListener } from '../ipcWrapper';
import { parseDate } from '../utils';

registerListener('db-books-find', async () => {
  const result = await db
    .select('isbn', 'name', 'publisher', 'type', 'codePe')
    .orderBy('updated_at', 'desc')
    .from('books');
  return result;
});

type BookInsertArgs = Book & {
  schoolYear: string;
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

registerListener('db-books-insert-or-get', async (args: Book[]) => {
  const books = await db.transaction(async (trx) => {
    return Promise.all(
      args.map(async (book) => {
        const result = await trx
          .select('isbn', 'name', 'publisher', 'type', 'schoolYear', 'codePe')
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
              schoolYear: book.schoolYear || null,
            })
            .into('books');
          return book;
        }
        return result[0];
      })
    );
  });
  return books;
});

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
        'created_at',
        'updated_at'
      )
      .where('isbn', isbn)
      .from('books');
    event.reply('db-result-book-find-one', {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      book: bookData.map((book: any) => ({
        ...book,
        created_at: parseDate(book.created_at),
        updated_at: parseDate(book.updated_at),
      }))[0],
    });
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

registerListener('utils-book-get-metadata', (isbn: string) =>
  getBookMetadata(isbn)
);

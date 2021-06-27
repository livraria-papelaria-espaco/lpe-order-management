import { ipcMain, IpcMainEvent } from 'electron';
import log from 'electron-log';
import db from '../database';

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

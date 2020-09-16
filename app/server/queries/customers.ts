import { ipcMain, IpcMainEvent } from 'electron';
import db from '../database';

ipcMain.on('db-customers-find', async (event: IpcMainEvent) => {
  console.log('event');
  const result = await db
    .select('id', 'name', 'phone', 'email')
    .from('customers');
  event.reply('db-result-customers-find', result);
});

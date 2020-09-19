import { ipcMain, IpcMainEvent } from 'electron';
import db from '../database';

ipcMain.on('db-customers-find', async (event: IpcMainEvent) => {
  const result = await db
    .select('id', 'name', 'phone', 'email')
    .orderBy('updated_at', 'desc')
    .from('customers');
  event.reply('db-result-customers-find', result);
});

type CustomerInsertArgs = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

ipcMain.on(
  'db-customers-insert',
  async (event: IpcMainEvent, args: CustomerInsertArgs) => {
    try {
      const result = await db.insert(args).into('customers');
      event.reply('db-result-customers-insert', result);
    } catch (e) {
      event.reply('db-result-customers-insert', false);
    }
  }
);

ipcMain.on('db-customer-find-one', async (event: IpcMainEvent, id: number) => {
  try {
    const customerData = await db
      .select('id', 'name', 'phone', 'email', 'created_at', 'updated_at')
      .where('id', id)
      .from('customers');
    event.reply('db-result-customer-find-one', { customer: customerData[0] });
  } catch (e) {
    event.reply('db-result-customer-find-one', false);
  }
});

ipcMain.on(
  'db-customer-update',
  async (event: IpcMainEvent, args: CustomerInsertArgs) => {
    console.log(args);
    try {
      await db('customers')
        .where('id', args.id)
        .update({ name: args.name, phone: args.phone, email: args.email });
      event.reply('db-result-customer-update', true);
    } catch (e) {
      console.error(e);
      event.reply('db-result-customer-update', false);
    }
  }
);
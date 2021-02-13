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
      const result = await db
        .insert({ created_at: db.fn.now(), updated_at: db.fn.now(), ...args })
        .into('customers');
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
    try {
      await db('customers').where('id', args.id).update({
        name: args.name,
        phone: args.phone,
        email: args.email,
        updated_at: db.fn.now(),
      });
      event.reply('db-result-customer-update', true);
    } catch (e) {
      event.reply('db-result-customer-update', false);
    }
  }
);

ipcMain.on('db-customer-delete', async (event: IpcMainEvent, id: number) => {
  try {
    await db('customers').where('id', id).del();
    event.reply('db-result-customer-delete', true);
  } catch (e) {
    event.reply('db-result-customer-delete', false);
  }
});

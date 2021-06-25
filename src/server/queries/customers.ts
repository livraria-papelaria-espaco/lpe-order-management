import { ipcMain, IpcMainEvent } from 'electron';
import log from 'electron-log';
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
  async (event: IpcMainEvent, { name, phone, email }: CustomerInsertArgs) => {
    try {
      const result = await db
        .insert({
          created_at: db.fn.now(),
          updated_at: db.fn.now(),
          name: name || null,
          phone: phone || null,
          email: email || null,
        })
        .into('customers');
      event.reply('db-result-customers-insert', result);
    } catch (e) {
      log.error('Failed to insert customer', e);
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
    log.error('Failed to find customer by ID', e);
    event.reply('db-result-customer-find-one', false);
  }
});

ipcMain.on(
  'db-customer-update',
  async (event: IpcMainEvent, args: CustomerInsertArgs) => {
    try {
      await db('customers')
        .where('id', args.id)
        .update({
          name: args.name || null,
          phone: args.phone || null,
          email: args.email || null,
          updated_at: db.fn.now(),
        });
      event.reply('db-result-customer-update', true);
    } catch (e) {
      log.error('Failed to update customer', e);
      event.reply('db-result-customer-update', false);
    }
  }
);

ipcMain.on('db-customer-delete', async (event: IpcMainEvent, id: number) => {
  try {
    await db('customers').where('id', id).del();
    event.reply('db-result-customer-delete', true);
  } catch (e) {
    log.error('Failed to delete customer', e);
    event.reply('db-result-customer-delete', false);
  }
});

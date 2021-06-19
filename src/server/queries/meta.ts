import { ipcMain, IpcMainEvent, app } from 'electron';

ipcMain.on('meta-app-version', async (event: IpcMainEvent) => {
  event.reply('meta-app-version-result', app.getVersion());
});

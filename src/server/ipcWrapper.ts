/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcMain, IpcMainEvent } from 'electron';
import log from 'electron-log';

export const registerListener = (
  channel: string,
  func: (...args: any[]) => any | Promise<any>,
  errorResponse: any = false
) => {
  ipcMain.on(
    channel,
    async (event: IpcMainEvent, id: number, ...args: any[]) => {
      try {
        log.debug(`Handling IPC event on channel ${channel}`);

        const result = await func(...args);
        event.reply(`${channel}-result-${id}`, result);

        log.debug(`Finished handling IPC event for channel ${channel}`);
      } catch (error) {
        log.error(
          `An unhandled exception happened while handling channel ${channel}`,
          error
        );

        event.reply(`${channel}-result-${id}`, errorResponse);
      }
    }
  );
};

export default {
  registerListener,
};

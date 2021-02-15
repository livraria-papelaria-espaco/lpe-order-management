import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import { getMetadataByURL } from '../../utils/bookMetadata';

ipcMain.on('order-import-wook-open', (event: IpcMainEvent) => {
  const window = new BrowserWindow({
    width: 1024,
    height: 728,
    webPreferences: {
      devTools: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  window.loadURL('https://www.wook.pt/comprar-manuais-escolares');

  window.webContents.session.clearStorageData({
    storages: ['cookies'],
  });

  const intervalId = setInterval(async () => {
    try {
      const data = await window.webContents.executeJavaScript(`
    [...document.getElementById("cestoProdutos").getElementsByTagName("li")].map((prod) => {
      return prod.getElementsByClassName("cover")[0].getAttributeNode("onclick").value.match(/\\d+/)[0]
    })
    `);

      if (data.length > 0) {
        clearInterval(intervalId);
        event.reply('order-import-wook-result', data);
        window.destroy();
      }
    } catch (e) {
      // Ignore
    }
  }, 1000);

  window.on('close', () => {
    clearInterval(intervalId);
    event.reply('order-import-wook-result', false);
  });
});

ipcMain.on(
  'order-import-wook-parse',
  async (event: IpcMainEvent, books: string[]) => {
    const metadata = await Promise.all(
      books.map((url) => getMetadataByURL(`https://wook.pt/Artigos/?id=${url}`))
    );
    event.reply('order-import-wook-parse-result', metadata);
  }
);

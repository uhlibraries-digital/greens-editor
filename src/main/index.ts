import { app, Menu, ipcMain, shell } from 'electron'
import { AppWindow } from './app-window'
import { buildDefaultMenu, MenuEvent } from './menu'
import { updateStore } from './update-store'

let mainWindow: AppWindow | null = null

// quit application when all windows are closed
app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  createMainWindow()

  let menu = buildDefaultMenu()
  Menu.setApplicationMenu(menu)

  if (!__DEV__) {
    updateStore.checkForUpdates()
  }

  ipcMain.on('menu-event', (event: Electron.IpcMainEvent, args: any[]) => {
    const { name }: { name: MenuEvent } = event as any
    if (mainWindow) {
      mainWindow.sendMenuEvent(name)
    }
  })

  ipcMain.on(
    'open-external',
    (event: Electron.IpcMainEvent, { path }: { path: string }) => {
      const result = shell.openExternal(path)
      event.sender.send('open-external-result', { result })
    }
  )

})

function createMainWindow() {
  const window = new AppWindow()

  window.onClose(() => {
    if (__DARWIN__) {
      app.quit()
    }
  })

  window.onDidLoad(() => {
    window.show()
  })
  window.load()

  mainWindow = window
}

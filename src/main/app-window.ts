import { BrowserWindow } from 'electron'
import * as path from 'path'
import { staticPath } from '../lib/path'
import { format as formatUrl } from 'url'
import { MenuEvent } from './menu'
import { Emitter, Disposable } from 'event-kit'

let windowStateKeeper: any | null = null

export class AppWindow {
  private window: Electron.BrowserWindow
  private emitter = new Emitter()

  private minWidth: number = 800
  private minHeight: number = 540

  public constructor() {
    if (!windowStateKeeper) {
      windowStateKeeper = require('electron-window-state')
    }

    const savedWindowState = windowStateKeeper({
      defaultWidth: this.minWidth,
      defaultHeight: this.minHeight,
      file: 'greens-editor-window-state.json'
    })

    const windowOptions: Electron.BrowserWindowConstructorOptions = {
      x: savedWindowState.x,
      y: savedWindowState.y,
      width: this.minWidth,
      height: this.minHeight,
      minWidth: this.minWidth,
      minHeight: this.minHeight,
      resizable: false,
      show: false,
      frame: false,
      titleBarStyle: 'hidden',
      backgroundColor: '#4d5057',
      webPreferences: {
        webSecurity: !__DEV__,
        nodeIntegration: true
      }
    }

    if (__LINUX__) {
      windowOptions.icon = path.join(staticPath(), 'icon-logo.png')
    }

    this.window = new BrowserWindow(windowOptions)
    savedWindowState.manage(this.window)
  }

  public load() {
    this.window.webContents.once('did-finish-load', () => {
      this.emitDidLoad()
    })

    if (__DEV__) {
      this.window.webContents.openDevTools()
      this.window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)

      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS
      } = require('electron-devtools-installer')

      installExtension(REACT_DEVELOPER_TOOLS)
        .then((name: string) => console.log(`Added Extension:  ${name}`))
        .catch((err: Error) => console.log('An error occurred: ', err))
    }
    else {
      this.window.loadURL(formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
      }))
    }
  }

  public onClose(fn: () => void) {
    this.window.on('closed', fn)
  }

  public onDidLoad(fn: () => void): Disposable {
    return this.emitter.on('did-load', fn)
  }

  public show() {
    this.window.show()
  }

  public sendMenuEvent(name: MenuEvent) {
    this.show()

    this.window.webContents.send('menu-event', { name })
  }

  private emitDidLoad() {
    this.emitter.emit('did-load', null)
  }

}
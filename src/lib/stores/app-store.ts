import { IAppState, ISettings, ViewType } from '../app-state'
import { TypedBaseStore } from './base-store'
import { electronStore } from './electron-store'
import { IErc, Minter } from '../minter'

const defaultSettings: ISettings = {
  endpoint: '',
  apiKey: ''
}

export class AppStore extends TypedBaseStore<IAppState> {

  private emitQueued = false

  private settings: ISettings = defaultSettings
  private selectedView: ViewType | null = ViewType.Editor
  private editingArk: string = ''
  private editingErc: IErc | undefined = undefined
  private minter: Minter | null = null
  private searchBusy: boolean = false
  private editingBusy: boolean = false
  private errors: ReadonlyArray<Error> = new Array<Error>()

  protected emitUpdate() {
    if (this.emitQueued) {
      return
    }
    this.emitQueued = true
    this.emitUpdateNow()
  }

  private emitUpdateNow() {
    this.emitQueued = false
    const state = this.getState()
    super.emitUpdate(state)
  }

  public getState(): IAppState {
    return {
      settings: this.settings,
      slectedView: this.selectedView,
      editingArk: this.editingArk,
      editingErc: this.editingErc,
      searchBusy: this.searchBusy,
      editingBusy: this.editingBusy,
      errors: this.errors
    }
  }

  public async loadInitialState() {
    
    this.settings = JSON.parse(String(electronStore.get('settings', 'null'))) as ISettings
    if (!this.settings) {
      this.settings = defaultSettings
      this.selectedView = ViewType.Settings
    }

    this.minter = new Minter(this.settings.endpoint, this.settings.apiKey)

    this.emitUpdateNow()
  }

  public _pushError(error: Error): Promise<void> {
    const newErrors = Array.from(this.errors)
    newErrors.push(error)
    this.errors = newErrors
    this.emitUpdate()

    return Promise.resolve()
  }

  public _clearError(error: Error): Promise<void> {
    this.errors = this.errors.filter(e => e !== error)
    this.emitUpdate()

    return Promise.resolve()
  }

  public _showSettings(): Promise<any> {
    this.selectedView = ViewType.Settings
    this.emitUpdate()

    return Promise.resolve()
  }

  public _closeSettings(): Promise<any> {
    this.selectedView = ViewType.Editor
    this.emitUpdate()

    return Promise.resolve()
  }

  public _saveSettings(endpoint: string, apiKey: string): Promise<any> {
    this.settings.endpoint = endpoint
    this.settings.apiKey = apiKey

    this.minter = new Minter(endpoint, apiKey)

    electronStore.set('settings', JSON.stringify(this.settings))

    this._clear()
    this.emitUpdate()

    return Promise.resolve()
  }

  public _mintArk(prefix: string, erc: IErc): Promise<any> {
    if (!this.minter) {
      return Promise.reject(new Error('Minter not setup'))
    }

    this.editingBusy = true
    this.emitUpdate()
    
    return this.minter.mint(prefix, erc)
      .then((id) => {
        this.selectedView = ViewType.Display
        this.editingArk = id
        this.editingErc = erc
      })
      .catch((err) => {
        console.error(err)
        this._pushError(err)
      })
      .then(() => {
        this.editingBusy = false
        this.emitUpdate()
      })
  }

  public _updateArk(ark: string, erc: IErc): Promise<any> {
    if (!this.minter) {
      return Promise.reject(new Error('Minter not setup'))
    }

    this.editingBusy = true
    this.editingErc = erc
    this.emitUpdate()

    return this.minter.update(ark, erc)
      .catch((err) => {
        console.error(err)
        this._pushError(err)
      })
      .then(() => {
        this.editingBusy = false
        this.editingErc = erc
        this.editingArk = ark
        this.emitUpdate()
      })
  }

  public _getArk(ark: string): Promise<any> {
    if (!this.minter) {
      return Promise.reject(new Error('Minter not setup'))
    }

    this.searchBusy = true
    this.editingArk = ark
    this.emitUpdate()

    return this.minter.get(ark)
      .then((erc: IErc) => {
        this.editingArk = ark
        this.editingErc = erc

        this.emitUpdate()
      })
      .catch((err) => {
        console.error(err)
        this.editingArk = ''
        this.editingErc = undefined
        this._pushError(err)

        this.emitUpdate()
      })
      .then(() => {
        this.searchBusy = false
        this.emitUpdate()
      })
  }

  public _clear(): Promise<any> {
    this.selectedView = ViewType.Editor
    this.editingArk = ''
    this.editingErc = undefined
    
    this.emitUpdate()

    return Promise.resolve()
  }
}
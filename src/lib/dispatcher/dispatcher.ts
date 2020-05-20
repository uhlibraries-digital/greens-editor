import { AppStore } from '../stores'
import { IErc } from '../minter'

export class Dispatcher {
  private readonly appStore: AppStore

  public constructor(appStore: AppStore) {
    this.appStore = appStore
  }

  public loadInitialState(): Promise<void> {
    return this.appStore.loadInitialState()
  }

  public saveSettings(endpoint: string, apiKey: string): Promise<void> {
    return this.appStore._saveSettings(endpoint, apiKey)
  }

  public showSettings(): Promise<void> {
    return this.appStore._showSettings()
  }

  public closeSettings(): Promise<void> {
    return this.appStore._closeSettings()
  }

  public mint(prefix: string, erc: IErc): Promise<void> {
    return this.appStore._mintArk(prefix, erc)
  }

  public update(ark: string, erc: IErc): Promise<void> {
    return this.appStore._updateArk(ark, erc)
  }

  public get(ark: string): Promise<void> {
    return this.appStore._getArk(ark)
  }

  public clear(): Promise<void> {
    return this.appStore._clear()
  }

  public clearError(error: Error): Promise<void> {
    return this.appStore._clearError(error)
  }

}
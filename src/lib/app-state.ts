import { IErc } from "./minter";

export enum ViewType{
  Editor,
  Display,
  Settings
}

export interface IAppState {
  readonly settings: ISettings,
  readonly slectedView: ViewType | null
  readonly editingArk: string
  readonly editingErc: IErc | undefined
  readonly searchBusy: boolean
  readonly editingBusy: boolean
  readonly errors: ReadonlyArray<Error>
}

export interface ISettings {
  endpoint: string
  apiKey: string
}

export enum UpdateStatus {
  Checking,
  UpdateAvailable,
  UpdateNotAvailable,
  UpdateReady
}

export interface IUpdateState {
  status: UpdateStatus
  lastCheck: Date | null
}
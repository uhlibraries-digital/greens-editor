import * as React from 'react'
import { Dispatcher } from '../lib/dispatcher'
import { AppStore } from '../lib/stores'
import { IAppState, ViewType } from '../lib/app-state'
import { TitleBar } from './window'
import { UiView } from './ui-view'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { Settings } from './settings/settings-view'
import { Search } from './search'
import { Editor } from './editor'
import { Display } from './display'
import { remote } from 'electron'
import { AppError } from './app-error'

interface IAppProps {
  readonly appStore: AppStore
  readonly dispatcher: Dispatcher
}

export const dialogTransitionEnterTimeout = 250
export const dialogTransitionLeaveTimeout = 100

export class App extends React.Component<IAppProps, IAppState> {

  public constructor(props: IAppProps) {
    super(props)

    props.dispatcher.loadInitialState()

    this.state = props.appStore.getState()
    props.appStore.onDidUpdate(state => {
      this.setState(state)
    })
  }

  private renderApp() {
    const state = this.state

    switch(state.slectedView) {
      case ViewType.Editor:
        return (
          <UiView id="editor-view">
            <Search
              dispatcher={this.props.dispatcher}
              ark={this.state.editingArk}
              busy={this.state.searchBusy}
            />
            {this.renderHeader()}
            <Editor
              dispatcher={this.props.dispatcher}
              ark={this.state.editingArk}
              erc={this.state.editingErc}
              busy={this.state.editingBusy}
            />
          </UiView>
        )
      case ViewType.Settings:
        return (
          <UiView id="settings-view">
            <Settings
              dispatcher={this.props.dispatcher}
              settings={this.state.settings}
            />
          </UiView>
        )
      case ViewType.Display:
        return (
          <UiView id="display-view">
            <Display
              dispatcher={this.props.dispatcher}
              ark={this.state.editingArk}
              erc={this.state.editingErc}
            />
          </UiView>
        )
    }

    return null
  }

  private onSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.props.dispatcher.showSettings()
  }

  private renderHeader() {
    if (!this.state.editingErc) {
      return (
        <h2 className="header-editor">Mint new ARK</h2>
      )
    }
    return (
      <h2 className="header-editor">Edit ARK</h2>
    )
  }

  private renderAppError() {
    return (
      <AppError
        errors={this.state.errors}
        onClearError={this.clearError}
      />
    )
  }

  private clearError = (error: Error) => this.props.dispatcher.clearError(error)

  public render() {

    return (
      <div id="app-container">
        <TitleBar>
          <button
            className="settings-button"
            title="Settings"
            onClick={this.onSettingsClick}
          >
            <FontAwesomeIcon
              icon={faCog}
              size="lg"
            />
          </button>
        </TitleBar>
        {this.renderApp()}
        {this.renderAppError()}
        <footer>
          <div className="app-name">
            <span className="name">{remote.app.name}</span>
            <span className="version">{remote.app.getVersion()}</span>
          </div>
        </footer>
      </div>
    )
  }
}
import * as React from 'react'
import { Dispatcher } from '../../lib/dispatcher'
import { ISettings } from '../../lib/app-state'
import { Row } from '../layout'
import { TextBox } from '../form'
import { Button, ButtonGroup } from '../button'

interface ISettingsViewProps {
  readonly dispatcher: Dispatcher
  readonly settings: ISettings
}

interface ISettingsViewState {
  readonly endpoint: string
  readonly apiKey: string
}

export class Settings extends React.Component<ISettingsViewProps, ISettingsViewState> {

  constructor(props: ISettingsViewProps) {
    super(props)

    this.state = {
      endpoint: this.props.settings.endpoint,
      apiKey: this.props.settings.apiKey
    }
  }

  private onSave = () => {
    this.props.dispatcher.saveSettings(this.state.endpoint, this.state.apiKey)
  }

  private onEndpointChange = (value: string) => {
    this.setState({ endpoint: value })
  }

  private onApiChange = (value: string) => {
    this.setState({ apiKey: value })
  }

  private onCancel = () => {
    this.props.dispatcher.closeSettings()
  }

  public render() {

    return (
      <div className="settings-container">
        <h1>Settings</h1>
        <div className="settings-content">
          <Row>
            <TextBox
              label="Endpoint"
              value={this.state.endpoint}
              onValueChanged={this.onEndpointChange}
              autoFocus={true}
            />
          </Row>
          <Row>
            <TextBox
              label="API Key"
              value={this.state.apiKey}
              onValueChanged={this.onApiChange}
            />
          </Row>
        </div>
        <div className="settings-buttons">
          <ButtonGroup>
            <Button onClick={this.onCancel}>Cancel</Button>
            <Button type="submit" onClick={this.onSave}>Save</Button>
          </ButtonGroup>
        </div>
      </div>
    )
  }



}
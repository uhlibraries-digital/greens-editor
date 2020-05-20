import * as React from 'react'
import { Dispatcher } from '../../lib/dispatcher'
import { Row } from '../layout'
import { IErc } from '../../lib/minter'
import { Button, ButtonGroup } from '../button'
import { remote } from 'electron'

interface IDisplayProps {
  readonly dispatcher: Dispatcher
  readonly ark: string
  readonly erc?: IErc
}

export class Display extends React.Component<IDisplayProps, {}> {

  private onClick = () => {
    this.props.dispatcher.clear()
  }

  private renderErc() {
    if (!this.props.erc) {
      return null
    }

    return (
      <div className="erc">
        <Row>
          <span className="label">who:</span><span className="content">{this.props.erc.who}</span>
        </Row>
        <Row>
          <span className="label">what:</span><span className="content">{this.props.erc.what}</span>
        </Row>
        <Row>
          <span className="label">when:</span><span className="content">{this.props.erc.when}</span>
        </Row>
        <Row>
          <span className="label">where:</span><span className="content">{this.props.erc.where}</span>
        </Row>
      </div>
    )
  }

  private onCopyToClipboard = () => {
    remote.clipboard.write({ text: this.props.ark })
  }

  public render() {
    return (
      <div className="display">
        <h2 className="header-editor">Minted Ark</h2>
        <Row>
          <div className="ark">
            <span>{this.props.ark}</span>
            <Button onClick={this.onCopyToClipboard}>Copy</Button>
          </div>
        </Row>
        <h2 className="header-editor">Erc</h2>
        <Row>
          {this.renderErc()}
        </Row>
        <ButtonGroup>
          <Button type="submit" onClick={this.onClick}>Done</Button>
        </ButtonGroup>
      </div>
    )
  }
}
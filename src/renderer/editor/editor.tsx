import * as React from 'react'
import { Dispatcher } from '../../lib/dispatcher'
import { Row } from '../layout'
import { TextBox } from '../form'
import { IErc } from '../../lib/minter'
import { Button, ButtonGroup } from '../button'
import { electronStore } from '../../lib/stores'

interface IEditorProps {
  readonly dispatcher: Dispatcher
  readonly busy: boolean
  readonly ark?: string
  readonly erc?: IErc
}

interface IEditorState {
  readonly prefix: string
  readonly who: string
  readonly what: string
  readonly when: string
  readonly where: string
}

export class Editor extends React.Component<IEditorProps, IEditorState> {

  constructor(props: IEditorProps) {
    super(props)

    const prefix = electronStore.get('prefix', '')

    if (this.props.erc) {
      this.state = {
        prefix: prefix,
        who: this.props.erc.who || '',
        what: this.props.erc.what || '',
        when: this.props.erc.when || '',
        where: this.props.erc.where || ''
      }
    }
    else {
      this.state = {
        prefix: prefix,
        who: '',
        what: '',
        when: '',
        where: ''
      }
    }
  }

  public componentWillReceiveProps(nextProps: IEditorProps) {
    if (nextProps.erc) {
      this.setState({ who: nextProps.erc.who || '' })
      this.setState({ what: nextProps.erc.what || '' })
      this.setState({ when: nextProps.erc.when || '' })
      this.setState({ where: nextProps.erc.where || '' })
    }
    else {
      this.setState({ who: '' })
      this.setState({ what: '' })
      this.setState({ when: '' })
      this.setState({ where: '' })
    }
  }


  public render() {
    return (
      <div className="editor">
        {this.renderPrefix()}
        <Row>
          <TextBox
            label="Who"
            value={this.state.who}
            onValueChanged={this.onWhoChange}
          />
        </Row>
        <Row>
          <TextBox
            label="What"
            value={this.state.what}
            onValueChanged={this.onWhatChange}
          />
        </Row>
        <Row>
          <TextBox
            label="When"
            value={this.state.when}
            onValueChanged={this.onWhenChange}
          />
        </Row>
        <Row>
          <TextBox
            label="Where"
            value={this.state.where}
            onValueChanged={this.onWhereChange}
          />
        </Row>
        {this.renderButtons()}
      </div>
    )
  }

  private onMint = () => {
    const erc: IErc = {
      who: this.state.who,
      what: this.state.what,
      when: this.state.when,
      where: this.state.where
    }
    electronStore.set('prefix', this.state.prefix)
    this.props.dispatcher.mint(this.state.prefix, erc)
  }

  private onUpdate = () => {
    const erc: IErc = {
      who: this.state.who,
      what: this.state.what,
      when: this.state.when,
      where: this.state.where
    }
    if (this.props.ark) {
      this.props.dispatcher.update(this.props.ark, erc)
    }
  }

  private onPrefixChange = (value: string) => {
    this.setState({ prefix: value })
  }

  private onWhoChange = (value: string) => {
    this.setState({ who: value })
  }

  private onWhatChange = (value: string) => {
    this.setState({ what: value })
  }

  private onWhenChange = (value: string) => {
    this.setState({ when: value })
  }

  private onWhereChange = (value: string) => {
    this.setState({ where: value})
  }

  private onReset = () => {
    this.props.dispatcher.clear()
  }

  private renderPrefix() {
    if (this.props.erc) {
      return null
    }

    return (
      <Row>
        <TextBox
          label="Prefix"
          value={this.state.prefix}
          onValueChanged={this.onPrefixChange}
        />
      </Row>
    )
  }

  private renderButtons() {
    const className = this.props.busy ? 'busy' : undefined

    if (this.props.erc) {
      return (
        <ButtonGroup>
          <Button
            onClick={this.onReset}
          >
            Reset
          </Button>
          <Button 
            type="submit" 
            onClick={this.onUpdate}
            disabled={this.props.busy}
            className={className}
          >
            Update
          </Button>
        </ButtonGroup>
      )
    }
    return (
      <ButtonGroup>
        <Button 
          type="submit" 
          onClick={this.onMint}
          disabled={this.props.busy}
          className={className}
        >
          Mint
        </Button>
      </ButtonGroup>
    )
  }
}
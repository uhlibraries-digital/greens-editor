import * as React from 'react'
import { Dispatcher } from '../../lib/dispatcher'
import { TextBox } from '../form'
import { Row } from '../layout'
import { Button, ButtonGroup } from '../button'

interface ISearchProps {
  readonly dispatcher: Dispatcher
  readonly ark?: string
  readonly busy: boolean
}

interface ISearchState {
  readonly ark: string
}

export class Search extends React.Component<ISearchProps, ISearchState> {

  constructor(props: ISearchProps) {
    super(props)

    this.state = {
      ark: this.props.ark || ''
    }
  }

  public componentWillReceiveProps(nextProps: ISearchProps) {
    this.setState({ ark: nextProps.ark || '' })
  }

  public render() {
    const buttonClass = this.props.busy ? 'busy' : undefined

    return (
      <div className="search">
        <Row>
          <TextBox
            label="ARK"
            value={this.state.ark}
            onValueChanged={this.onValueChange}
            disabled={this.props.busy}
            onKeyDown={this.onKeyDown}
          />
        </Row>
        <ButtonGroup>
          <Button 
            type="submit" 
            onClick={this.onSearch}
            disabled={this.props.busy}
            className={buttonClass}
          >
            Edit ARK
          </Button>
        </ButtonGroup>
      </div>
    )
  }

  private onValueChange = (value: string) => {
    this.setState({ ark: value })
  }

  private onSearch = () => {
    this.props.dispatcher.get(this.state.ark)
  }

  private onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      this.onSearch()
    }
  }
}
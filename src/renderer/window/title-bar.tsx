import * as React from 'react'
import { WindowControls } from './window-controls'

export class TitleBar extends React.Component<{}, {}> {

  public render() {
    return (
      <header
        className="selection-header"
      >
        {this.props.children}
        <WindowControls />
      </header>
    )

  }

}
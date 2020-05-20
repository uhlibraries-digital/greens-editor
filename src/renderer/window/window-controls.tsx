import * as React from 'react'
import * as classNames from 'classnames'
import { remote } from 'electron'

const closePath =
  'M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z'
const minimizePath = 'M 0,5 10,5 10,6 0,6 Z'


export class WindowControls extends React.Component<{}, {}> {


  private onMinimize = () => {
    remote.getCurrentWindow().minimize()
  }

  private onClose = () => {
    remote.getCurrentWindow().close()
  }

  private renderButton(
    name: string, 
    onClick: React.EventHandler<React.MouseEvent<any>>, 
    path: string
  ) {
    const className = classNames('window-control', name)
    const title = name[0].toUpperCase() + name.substring(1)

    return (
      <button
        aria-label={name}
        title={title}
        tabIndex={-1}
        className={className}
        onClick={onClick}
      >
        <svg aria-hidden="true" version="1.1" width="10" height="10">
          <path d={path} />
        </svg>
      </button>

    )

  }

  public render() {
    if (!__WIN32__) {
      return (
        <span />
      )
    }

    return (
      <div className="window-controls">
        {this.renderButton('minimize', this.onMinimize, minimizePath)}
        {this.renderButton('close', this.onClose, closePath)}
      </div>
    )
  }
}
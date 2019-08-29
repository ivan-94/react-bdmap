import React from 'react'
import ReactDOM from 'react-dom'
import { CopyrightItemProps } from './type'

let uid: number = 0
export default class Item extends React.PureComponent<CopyrightItemProps> {
  private innerEl: HTMLDivElement = document.createElement('div')
  private id: number = uid++

  public componentDidMount() {
    if (this.props.control) {
      this.addCopyright()
    }
  }

  public componentDidUpdate() {
    if (this.props.control) {
      this.props.control.removeCopyright(this.id)
      this.addCopyright()
    }
  }

  public componentWillUnmount() {
    if (this.props.control) {
      this.props.control.removeCopyright(this.id)
    }
  }

  public render(): React.ReactElement {
    return ReactDOM.createPortal(this.props.children, this.innerEl)
  }

  private addCopyright() {
    this.props.control!.addCopyright({
      id: this.id,
      bounds: this.props.bounds,
      content: this.innerEl.innerHTML,
    })
  }
}

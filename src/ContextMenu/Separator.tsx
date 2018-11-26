import React from 'react'
import { ContextMenuSeparatorProps } from './type'

/**
 * 菜单分隔符
 */
export default class Separator extends React.PureComponent<ContextMenuSeparatorProps> {
  public componentDidMount() {
    if (this.props.contextMenu == null) {
      throw new Error(`ContextMenu.Separator should be used under ContextMenu`)
    }
    this.props.contextMenu.addSep(this)
  }

  public componentWillUnmount() {
    this.props.contextMenu!.removeSep(this)
  }

  public render() {
    return null
  }
}

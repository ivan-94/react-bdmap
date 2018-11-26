import React from 'react'
import { ContextMenuItemProps } from './type'

/**
 * 菜单项
 */
export default class Item extends React.PureComponent<ContextMenuItemProps> {
  private instance: BMap.MenuItem
  public constructor(props: any) {
    super(props)
    const { children, width, icon, disabled } = this.props
    this.instance = new BMap.MenuItem(children, this.handleClick.bind(this), {
      width,
      iconUrl: icon,
    })

    if (disabled) {
      this.instance.disable()
    }
  }

  public componentDidMount() {
    if (this.props.contextMenu == null) {
      throw new Error(`ContextMenu.Item should be used under ContextMenu`)
    }

    this.props.contextMenu.addItem(this.instance)
  }

  public componentDidUpdate(prevProps: ContextMenuItemProps) {
    if (this.props.children != prevProps.children) {
      this.instance.setText(this.props.children)
    }

    if (this.props.icon != prevProps.icon) {
      this.instance.setIcon(this.props.icon!)
    }

    if (this.props.disabled != prevProps.disabled) {
      this.props.disabled ? this.instance.disable() : this.instance.enable()
    }
  }

  public componentWillUnmount() {
    this.props.contextMenu!.removeItem(this.instance)
  }

  public render() {
    return null
  }

  private handleClick() {
    if (this.props.onClick) {
      this.props.onClick()
    }
  }
}

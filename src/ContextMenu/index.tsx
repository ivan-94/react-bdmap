/**
 * TODO: 如何避免条件渲染乱序
 */
import React from 'react'
import { BDMapContext } from '../BDMap'
import { MESSAGE_CONTEXT_MISSING } from '../constants'
import { initializeEvents, updateEvents } from '../utils'
import Item from './Item'
import Separator from './Separator'
import { ContextMenuProps, IContextMenu } from './type'
export * from './type'

/**
 * 右键菜单, 用于Map下或作为Marker的下级组件
 */
export default class ContextMenu extends React.Component<ContextMenuProps> implements IContextMenu {
  public static contextType = BDMapContext
  public static Item = Item
  public static Separator = Separator

  public context!: React.ContextType<typeof BDMapContext>
  private instance: BMap.ContextMenu
  private seps: object[] = []
  private container: BMap.Map | BMap.Marker
  private events = ['open', 'close']

  public constructor(props: ContextMenuProps) {
    super(props)

    this.instance = new BMap.ContextMenu()
  }

  public componentDidMount() {
    if (this.context == null) {
      throw new Error('ContextMenu: ' + MESSAGE_CONTEXT_MISSING)
    }
    const { overlay } = this.props
    const container = (this.container =
      overlay && overlay instanceof BMap.Marker ? overlay : this.context.nativeInstance!)

    if (overlay && container !== overlay) {
      console.warn(`ContextMenu used under overlay, but it only work under Marker`)
    }

    if (container) {
      container.addContextMenu(this.instance)
    }

    initializeEvents(this.events, this.instance, this.props)
  }

  public componentDidUpdate(prevProps: ContextMenuProps) {
    updateEvents(this.events, this.instance, this.props, prevProps)
  }

  public componentWillUnmount() {
    if (this.container) {
      this.container.removeContextMenu(this.instance)
    }
  }

  public render() {
    return React.Children.map(this.props.children, child => {
      return React.isValidElement(child)
        ? React.cloneElement(child as React.ReactElement<{ contextMenu?: any }>, {
            contextMenu: this,
          })
        : child
    })
  }

  public addItem(item: BMap.MenuItem) {
    this.instance.addItem(item)
  }

  public removeItem(item: BMap.MenuItem) {
    this.instance.removeItem(item)
  }

  public addSep(sep: object) {
    this.seps.push(sep)
    this.instance.addSeparator()
  }

  public removeSep(sep: object) {
    const index = this.seps.indexOf(sep)
    if (index !== -1) {
      this.instance.removeSeparator(index)
      this.seps.splice(index, 1)
    }
  }
}

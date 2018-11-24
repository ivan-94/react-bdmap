/**
 * TODO: 如何避免条件渲染乱序
 */
import React from 'react'
import { BDMapContext } from './BDMap'
import { MESSAGE_CONTEXT_MISSING } from './constants'

export interface ContextMenuProps {
  /** @ignore 作为Marker的下级节点 */
  overlay?: BMap.Marker
}

export interface ContextMenuItemProps {
  children: string
  disabled?: boolean
  width?: number
  onClick?: () => void
  icon?: string
  /**
   * @ignore
   */
  contextMenu?: ContextMenu
}

/**
 * 右键菜单, 用于Map下或作为Marker的下级组件
 */
export default class ContextMenu extends React.Component<ContextMenuProps> {
  public static contextType = BDMapContext
  public static Item = class extends React.PureComponent<ContextMenuItemProps> {
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

  public static Separator = class extends React.PureComponent<{
    contextMenu: ContextMenu
  }> {
    public componentDidMount() {
      if (this.props.contextMenu == null) {
        throw new Error(`ContextMenu.Separator should be used under ContextMenu`)
      }
      this.props.contextMenu.addSep(this)
    }

    public componentWillUnmount() {
      this.props.contextMenu.removeSep(this)
    }

    public render() {
      return null
    }
  }

  public context!: React.ContextType<typeof BDMapContext>
  private instance: BMap.ContextMenu
  private seps: object[] = []
  private container: BMap.Map | BMap.Marker

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

  protected addItem(item: BMap.MenuItem) {
    this.instance.addItem(item)
  }

  protected removeItem(item: BMap.MenuItem) {
    this.instance.removeItem(item)
  }

  protected addSep(sep: object) {
    this.seps.push(sep)
    this.instance.addSeparator()
  }

  protected removeSep(sep: object) {
    const index = this.seps.indexOf(sep)
    if (index !== -1) {
      this.instance.removeSeparator(index)
      this.seps.splice(index, 1)
    }
  }
}

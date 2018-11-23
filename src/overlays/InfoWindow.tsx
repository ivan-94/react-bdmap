import React from 'react'
import ReactDOM from 'react-dom'
import { BDMapContext } from '../BDMap'
import {
  initializeSettableProperties,
  updateSettableProperties,
  initializeEnableableProperties,
  updateEnableableProperties,
  initializeEvents,
  updateEvents,
} from '../utils'

export interface InfoWindowProps {
  /**
   * 是否打开, 受控模式
   */
  open?: boolean
  /**
   * open变动，受控模式
   */
  onChange?: (open: boolean) => void
  /** 渲染消息窗的内容 */
  children: React.ReactNode

  /** 当前位置, 显示传入或者作为其他覆盖物的下级，有上级覆盖传入 */
  position?: BMap.Point
  width?: number
  height?: number
  title?: string

  enableMaximize?: boolean
  enableAutoPan?: boolean
  enableCloseOnClick?: boolean

  // 固定参数
  enableMessage?: boolean
  maxWidth?: number
  offset?: BMap.Size
  message?: string

  // 事件
  onClose: (event: { type: string; target: any; point: BMap.Point }) => void
  onOpen: (event: { type: string; target: any; point: BMap.Point }) => void
  onMaximize: (event: { type: string; target: any }) => void
  onRestore: (event: { type: string; target: any }) => void
  onClickclose: (event: { type: string; target: any }) => void
}

const PROPERTIES = ['width', 'height', 'title']
const ENABLEABLE_PROPERTIES = ['maximize', 'autoPan', 'closeOnClick']
const EVENTS = ['close', 'open', 'maximize', 'restore', 'clickclose']

/**
 * 表示地图上包含信息的窗口
 */
export default class InfoWindow extends React.PureComponent<InfoWindowProps> {
  public static contextType = BDMapContext
  public context!: React.ContextType<typeof BDMapContext>
  public static defaultProps: Partial<InfoWindowProps> = {
    enableMaximize: false,
    enableAutoPan: true,
    enableCloseOnClick: true,
  }

  private elm = document.createElement('div')
  private instance: BMap.InfoWindow
  private opened: boolean = false
  protected extendedProperties: string[] = []
  protected extendedEnableableProperties: string[] = []
  protected extendedEvents: string[] = []

  public componentDidMount() {
    const { maxWidth, offset, message, enableMessage, position, open } = this.props
    if (position == null) {
      throw new TypeError('InfoWindow: position is required')
    }

    this.extendedProperties = PROPERTIES
    this.extendedEnableableProperties = ENABLEABLE_PROPERTIES
    this.extendedEvents = EVENTS

    this.instance = new BMap.InfoWindow(this.elm, {
      maxWidth,
      offset,
      message,
      enableMessage,
    })

    this.initialProperties()

    this.setVisible(open)
  }

  public componentDidUpdate(prevProps: InfoWindowProps) {
    this.updateProperties(prevProps)
    if (this.props.position !== prevProps.position) {
      this.updatePosition(this.props.position)
    }

    if (this.props.open !== prevProps.open) {
      this.setVisible(this.props.open)
    }
  }

  public componentWillUnmount() {
    // TODO:
  }

  public render() {
    return ReactDOM.createPortal(this.props.children, this.elm)
  }

  protected initialProperties() {
    // initial property
    initializeSettableProperties(this.extendedProperties, this.instance, this.props)
    initializeEnableableProperties(this.extendedEnableableProperties, this.instance, this.props)

    // initial events
    initializeEvents(this.extendedEvents, this.instance, this.props, this)
  }

  protected updateProperties(prevProps: InfoWindowProps) {
    // update properties
    updateSettableProperties(this.extendedProperties, this.instance, this.props, prevProps)
    updateEnableableProperties(
      this.extendedEnableableProperties,
      this.instance,
      this.props,
      prevProps,
    )

    // update Events
    updateEvents(this.extendedEvents, this.instance, this.props, prevProps, this)
  }

  protected handleOpen = (evt: any) => {
    if (this.props.onOpen) {
      this.props.onOpen(evt)
    }

    if (this.props.onChange) {
      this.props.onChange(true)
    }
  }

  protected handleClose = (evt: any) => {
    if (this.props.onClose) {
      this.props.onClose(evt)
    }

    if (this.props.onChange) {
      this.props.onChange(false)
    }
  }

  protected handleClickclose = (evt: any) => {
    if (this.props.onClickclose) {
      this.props.onClickclose(evt)
    }

    if (this.props.onChange) {
      this.props.onChange(false)
    }
  }

  private setVisible(show?: boolean) {
    const { position } = this.props
    if (position == null) {
      return
    }

    if (show) {
      if (!this.opened) {
        this.context.nativeInstance!.openInfoWindow(this.instance, position)
        this.opened = true
        return
      }

      // 位置没有变动
      if (this.instance.getPosition().equals(position)) {
        if (this.instance.isOpen()) {
          return
        }

        this.instance.show!()
        return
      }

      // 更新到最新position
      this.context.nativeInstance!.openInfoWindow(this.instance, position)
    } else {
      if (this.opened) {
        this.instance.hide!()
      }
    }
  }

  private updatePosition(position?: BMap.Point) {
    if (position == null || !this.opened || !this.instance.isOpen()) {
      return
    }

    this.setVisible(true)
  }
}

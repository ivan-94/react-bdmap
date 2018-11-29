/**
 * TODO: redraw
 */
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
  override,
} from '../utils'

export interface InfoWindowProps {
  /**
   * 是否打开, 支持受控模式
   */
  open?: boolean
  /**
   * open变动，支持受控模式
   */
  onChange?: (open: boolean) => void

  /** 当前位置, 显示传入或者作为其他覆盖物的下级，由上级覆盖物传入 */
  position?: BMap.Point
  /** 设置信息窗口的宽度，单位像素。取值范围：220 - 730 */
  width?: number
  /** 设置信息窗口的高度，单位像素。取值范围：60 - 650 */
  height?: number
  /** 设置信息窗口标题。支持HTML内容。1.2版本开始title参数支持传入DOM结点 */
  title?: React.ReactNode
  /** 渲染消息窗的内容 */
  children: React.ReactNode

  /**
   * 启用窗口最大化功能。需要设置最大化后信息窗口里的内容，该接口才生效
   */
  enableMaximize?: boolean
  /**
   * 开启打开信息窗口时地图自动平移
   */
  enableAutoPan?: boolean
  /**
   * 开启点击地图时关闭信息窗口
   */
  enableCloseOnClick?: boolean

  // 固定参数
  /** 是否在信息窗里显示短信发送按钮（默认开启） */
  enableMessage?: boolean
  /**
   * 信息窗最大化时的宽度，单位像素。取值范围：220 - 730
   */
  maxWidth?: number
  /**
   * 信息窗位置偏移值。默认情况下在地图上打开的信息窗底端的尖角将指向其地理坐标，
   * 在标注上打开的信息窗底端尖角的位置取决于标注所用图标的infoWindowOffset属性值，
   * 您可以为信息窗添加偏移量来改变默认位置
   */
  offset?: BMap.Size
  /**
   * 自定义部分的短信内容，可选项。完整的短信内容包括：自定义部分+位置链接，不设置时，显示默认短信内容。短信内容最长为140个字
   */
  message?: string

  // 事件
  onClose?: (event: { type: string; target: any; point: BMap.Point }) => void
  onOpen?: (event: { type: string; target: any; point: BMap.Point }) => void
  onMaximize?: (event: { type: string; target: any }) => void
  onRestore?: (event: { type: string; target: any }) => void
  onClickClose?: (event: { type: string; target: any }) => void
}

const PROPERTIES = ['width', 'height']
const ENABLEABLE_PROPERTIES = ['maximize', 'closeOnClick']
const EVENTS = ['close', 'open', 'maximize', 'restore', 'click_close']

/**
 * 表示地图上包含信息的窗口
 */
export default class InfoWindow extends React.PureComponent<InfoWindowProps> {
  public static contextType = BDMapContext
  public context!: React.ContextType<typeof BDMapContext>
  public static defaultProps = {
    enableMaximize: false,
    enableAutoPan: true,
    enableCloseOnClick: true,
  }

  private elm = document.createElement('div')
  private titleElm = document.createElement('div')
  private instance: BMap.InfoWindow
  private opened: boolean = false
  protected extendedProperties: string[] = []
  protected extendedEnableableProperties: string[] = []
  protected extendedEvents: string[] = []

  public componentDidMount() {
    const { maxWidth, offset, message, enableMessage, position, open, enableAutoPan } = this.props
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
      enableAutoPan: false,
    })

    this.instance.setTitle(this.titleElm)
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
    // TODO: 目前baidu文档上没有看到任何关于销毁InfoWindow的方法
    this.setVisible(false)
  }

  public render() {
    return (
      <>
        {ReactDOM.createPortal(this.props.children, this.elm)}
        {ReactDOM.createPortal(this.props.title, this.titleElm)}
      </>
    )
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
    updateEnableableProperties(this.extendedEnableableProperties, this.instance, this.props, prevProps)

    // update Events
    updateEvents(this.extendedEvents, this.instance, this.props, prevProps, this)
  }

  protected handleOpen = override('onOpen', (evt: any) => {
    if (this.props.onChange) {
      this.props.onChange(true)
    }
  })

  protected handleClose = override('onClose', (evt: any) => {
    if (this.props.onChange) {
      this.props.onChange(false)
    }
  })

  protected handleClickClose = override('onClickClose', (evt: any) => {
    if (this.props.onChange) {
      this.props.onChange(false)
    }
  })

  private setVisible(show?: boolean) {
    const { position } = this.props
    if (position == null) {
      return
    }

    if (show) {
      const map = this.context.nativeInstance!
      if (!this.opened) {
        map.openInfoWindow(this.instance, position)
        this.opened = true
      } else if (this.instance.getPosition().equals(position)) {
        // 位置没有变动
        if (!this.instance.isOpen()) {
          this.instance.show!()
        }
      } else {
        // 更新到最新position
        this.context.nativeInstance!.openInfoWindow(this.instance, position)
      }

      // 平移到目标位置
      if (this.props.enableAutoPan) {
        map.panTo(position)
      }
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

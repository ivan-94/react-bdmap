import React from 'react'
import upperFirst from 'lodash/upperFirst'
import { isAndroid, initializeEvents, updateEvents } from './utils'

export interface BDMapProps {
  className?: string
  style?: React.CSSProperties

  /**
   * enableable properties
   */
  /** 启用地图拖拽，默认启用 */
  enableDragging?: boolean
  /** 启用滚轮放大缩小，默认禁用 */
  enableScrollWheelZoom?: boolean
  /** 启用双击放大，默认启用 */
  enableDoubleClickZoom?: boolean
  /** 启用键盘操作，默认禁用。键盘的上、下、左、右键可连续移动地图。同时按下其中两个键可使地图进行对角移动。PgUp、PgDn、Home和End键会使地图平移其1/2的大小。+、-键会使地图放大或缩小一级 */
  enableKeyboard?: boolean
  /** 启用地图惯性拖拽，默认禁用 */
  enableInertialDragging?: boolean
  /** 启用连续缩放效果，默认禁用 */
  enableContinuousZoom?: boolean
  /** 启用双指操作缩放，默认启用 */
  enablePinchToZoom?: boolean
  /** 启用自动适应容器尺寸变化，默认启用 */
  enableAutoResize?: boolean

  /**
   * settable properties
   */
  /** 设置地图默认的鼠标指针样式。参数cursor应符合CSS的cursor属性规范 */
  defaultCursor?: string
  /** 设置拖拽地图时的鼠标指针样式。参数cursor应符合CSS的cursor属性规范 */
  draggingCursor?: string
  /** 设置地图允许的最小级别。取值不得小于地图类型所允许的最小级别, 默认是3 */
  minZoom?: number
  /** 设置地图允许的最大级别。取值不得大于地图类型所允许的最大级别, 默认是18  */
  maxZoom?: number
  /** 设置地图样式，样式包括地图底图颜色和地图要素是否展示两部分 */
  mapStyle?: BMap.MapStyle
  /** 设置地图个性化样式V2版本，仅支持现代浏览器 */
  mapStyleV2?: any[]
  /** 将全景实例与Map类进行绑定 */
  panorama?: BMap.Panorama
  /** 设置地图类型。注意，当设置地图类型为BMAP_PERSPECTIVE_MAP时，需要调用map.setCurrentCity方法设置城市 */
  mapType?: BMap.MapType

  /**
   * controlled properties
   */
  zoom?: number
  center?: BMap.Point

  /**
   * events from Native Map
   */

  onClick?: (
    event: {
      type: string
      target: any
      point: BMap.Point
      pixel: BMap.Pixel
      overlay: BMap.Overlay
    },
  ) => void
  onDblclick?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onRightclick?: (
    event: {
      type: string
      target: any
      point: BMap.Point
      pixel: BMap.Pixel
      overlay: BMap.Overlay
    },
  ) => void
  onRightdblclick?: (
    event: {
      type: string
      target: any
      point: BMap.Point
      pixel: BMap.Pixel
      overlay: BMap.Overlay
    },
  ) => void
  onMaptypechange?: (event: { type: string; target: any }) => void
  onMousemove?: (
    event: {
      type: string
      target: any
      point: BMap.Point
      pixel: BMap.Pixel
      overlay: BMap.Overlay
    },
  ) => void
  onMouseover?: (event: { type: string; target: any }) => void
  onMouseout?: (event: { type: string; target: any }) => void
  onMovestart?: (event: { type: string; target: any }) => void
  onMoving?: (event: { type: string; target: any }) => void
  onMoveend?: (event: { type: string; target: any }) => void
  onZoomstart?: (event: { type: string; target: any }) => void
  onZoomend?: (event: { type: string; target: any }) => void
  onAddoverlay?: (event: { type: string; target: any }) => void
  onAddcontrol?: (event: { type: string; target: any }) => void
  onRemovecontrol?: (event: { type: string; target: any }) => void
  onRemoveoverlay?: (event: { type: string; target: any }) => void
  onClearoverlays?: (event: { type: string; target: any }) => void
  onDragstart?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onDragging?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onDragend?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onAddtilelayer?: (event: { type: string; target: any }) => void
  onRemovetilelayer?: (event: { type: string; target: any }) => void
  onLoad?: (
    event: {
      type: string
      target: any
      point: BMap.Point
      pixel: BMap.Pixel
      zoom: number
    },
  ) => void
  onResize?: (event: { type: string; target: any; size: BMap.Size }) => void
  onHotspotclick?: (event: { type: string; target: any; spots: BMap.HotspotOptions }) => void
  onHotspotover?: (event: { type: string; target: any; spots: BMap.HotspotOptions }) => void
  onHotspotout?: (event: { type: string; target: any; spots: BMap.HotspotOptions }) => void
  onTilesloaded?: (event: { type: string; target: any }) => void
  onTouchstart?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onTouchmove?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onTouchend?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onLongpress?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
}

export interface BDMapContextValue {
  nativeInstance?: BMap.Map
  container?: BDMap
}

interface State {
  error?: Error
  context: BDMapContextValue
}

/**
 * 百度地图支持的属性
 */
const BDMAP_PROPERTIES = [
  { name: 'dragging', type: 'enableable', defaultValue: true },
  { name: 'scrollWheelZoom', type: 'enableable', defaultValue: false },
  { name: 'doubleClickZoom', type: 'enableable', defaultValue: true },
  { name: 'keyboard', type: 'enableable', defaultValue: false },
  { name: 'inertialDragging', type: 'enableable', defaultValue: false },
  { name: 'continuousZoom', type: 'enableable', defaultValue: false },
  { name: 'pinchToZoom', type: 'enableable', defaultValue: true },
  { name: 'autoResize', type: 'enableable', defaultValue: true },
  // settable
  { name: 'defaultCursor', type: 'settable', default: 'default' },
  { name: 'draggingCursor', type: 'settable', default: 'grabbing' },
  { name: 'minZoom', type: 'settable', defaultValue: 3 },
  { name: 'maxZoom', type: 'settable', defaultValue: 18 },
  { name: 'mapStyle', type: 'settable' },
  { name: 'mapStyleV2', type: 'settable' },
  { name: 'panorama', type: 'settable' },
  { name: 'mapType', type: 'settable', defaultValue: () => BMap && BMAP_NORMAL_MAP },
  { name: 'zoom', type: 'settable', defaultValue: 15 },
  {
    name: 'center',
    type: 'settable',
    methodName: 'centerAndZoom',
    method: (map: BMap.Map, props: object, value: any) => {
      if (value == null) {
        return
      }
      map.centerAndZoom(value, map.getZoom())
    },
  },
]

const BDMAP_EVENTS = [
  'click',
  'dblclick',
  'rightclick',
  'rightdblclick',
  'maptypechange',
  'mousemove',
  'mouseover',
  'mouseout',
  'movestart',
  'moving',
  'moveend',
  'zoomstart',
  'zoomend',
  'addoverlay',
  'addcontrol',
  'removecontrol',
  'removeoverlay',
  'clearoverlays',
  'dragstart',
  'dragging',
  'dragend',
  'addtilelayer',
  'removetilelayer',
  'load',
  'resize',
  'hotspotclick',
  'hotspotover',
  'hotspotout',
  'tilesloaded',
  'touchstart',
  'touchmove',
  'touchend',
  'longpress',
]

export const BDMapContext = React.createContext<BDMapContextValue>({})

/**
 * 这是Baidu地图的核心组件, 表示一个地图实例. 所有控件, 覆盖物, 图层都是在这个上下文中进行渲染
 */
export default class BDMap extends React.Component<BDMapProps, State> {
  public state: State = {
    context: {
      nativeInstance: undefined,
      container: this,
    },
  }
  private el = React.createRef<HTMLDivElement>()
  private map: BMap.Map

  public componentDidMount() {
    if (window.BMap) {
      this.initializeMap()
      return
    }
    throw new TypeError('BDMap should be used under BDMapLoader')
  }

  public componentDidUpdate(prevProps: BDMapProps, prevState: State) {
    if (this.map == null) {
      return
    }

    BDMAP_PROPERTIES.forEach(property => {
      const { name, type, defaultValue, method } = property
      const upperName = upperFirst(name)

      if (type === 'enableable') {
        const propsName = `enable${upperName}`

        if (this.props[propsName] !== prevProps[propsName]) {
          const value = this.props[propsName] != null ? this.props[propsName] : defaultValue
          const methodName = value ? propsName : `disable${upperName}`

          if (typeof this.map[methodName] === 'function') {
            this.map[methodName](value)
          }
        }
      } else {
        if (this.props[name] !== prevProps[name]) {
          const defaultPropsName = `default${upperName}`
          const value =
            this.props[name] != null
              ? this.props[name]
              : this.props[defaultPropsName] != null
              ? this.props[defaultPropsName]
              : typeof defaultValue === 'function'
              ? defaultValue()
              : defaultValue
          if (method) {
            method(this.map, this.props, value)
            return
          }

          const methodName = `set${upperName}`
          if (typeof this.map[methodName] === 'function') {
            this.map[methodName](value)
          }
        }
      }
    })

    // update eventListeners
    updateEvents(BDMAP_EVENTS, this.map, this.props, prevProps, this)
  }

  public render() {
    const { children, className, style } = this.props
    const { context } = this.state
    return (
      <BDMapContext.Provider value={context}>
        <div className={`bdmap ${className || ''}`} ref={this.el} style={style}>
          {!!context.nativeInstance && children}
        </div>
      </BDMapContext.Provider>
    )
  }

  /**
   * 获取地图实例
   * @alias getMap
   */
  public getInstance(): BMap.Map | undefined {
    return this.map
  }

  /**
   * 获取地图实例
   * @alias getInstance
   */
  public getMap(): BMap.Map | undefined {
    return this.map
  }

  /**
   * initialize BDMap instance
   */
  private initializeMap = () => {
    // TODO: 处理固定参数
    const map = new BMap.Map(this.el.current!, {
      enableMapClick: true,
    })

    // initialize properties
    BDMAP_PROPERTIES.forEach(property => {
      const { name, type, method } = property
      const upperName = upperFirst(name)

      if (type === 'enableable') {
        const propsName = `enable${upperName}`
        if (this.props[propsName] != null) {
          const methodName = this.props[propsName] ? propsName : `disable${upperName}`
          if (typeof map[methodName] === 'function') {
            map[methodName]()
          }
        }
      } else {
        // settable
        const defaultPropsName = `default${upperName}`
        const value = this.props[name] || this.props[defaultPropsName]
        if (value != null) {
          if (method) {
            method(map, this.props, value)
            return
          }
          const methodName = `set${upperName}`
          if (typeof map[methodName] === 'function') {
            map[methodName](value)
          }
        }
      }
    })

    // initialize events
    initializeEvents(BDMAP_EVENTS, this.map, this.props, this)

    if (isAndroid) {
      ;(map as any).addEventListener('touchstart', () => {
        map.disableDragging()
      })
      ;(map as any).addEventListener('touchmove', () => {
        map.enableDragging()
      })
      ;(map as any).addEventListener('touchend', () => {
        map.disableDragging()
      })
    }

    // 清空等待队列
    // setTimeout(() => {
    //   const queue = BDMap.waiterQueue
    //   BDMap.waiterQueue = []
    //   queue.forEach(resolve => resolve())
    // }, 100)

    this.map = map
    this.setState({
      context: {
        nativeInstance: map,
        container: this,
      },
    })
  }
}

/**
 * Map Container
 */
import React from 'react'
import { Coord } from './type'
import { delay, importScript, isAndroid } from './utils'
import upperFirst from 'lodash/upperFirst'

export interface BDMapProps {
  // api key
  apiKey: string

  className?: string
  style?: React.CSSProperties
  /**
   * properties
   */
  enableDragging?: boolean
  enableScrollWheelZoom?: boolean
  enableDoubleClickZoom?: boolean
  enableKeyboard?: boolean
  enableInertialDragging?: boolean
  enableContinuousZoom?: boolean
  enablePinchToZoom?: boolean
  enableAutoResize?: boolean
  minZoom?: number
  maxZoom?: number
  mapStyle?: number
  defaultZoom?: number
  // 受控模式zoom
  zoom?: number
  defaultCenter?: BMap.Point
  // 受控模式
  center?: BMap.Point

  /**
   * events
   */
  onClick?: (point: Coord, overlay: BMap.Overlay | null) => void
  onReady?: (ref: BMap.Map) => void
}

export interface BDMapContextValue {
  nativeInstance?: BMap.Map
  container?: BDMap
}

declare global {
  interface Window {
    loadBDMap?: () => void
    BMap: typeof BMap
  }
}

interface State {
  error?: Error
  context: BDMapContextValue
}

const DEFAULT_RETRY_TIME = 3
const enablableProperties = [
  'dragging',
  'scrollWheelZoom',
  'doubleClickZoom',
  'keyboard',
  'inertialDragging',
  'continuousZoom',
  'pinchToZoom',
  'autoResize',
]
const settableProperties = ['minZoom', 'maxZoom', 'mapStyle', 'zoom']

export const BDMapContext = React.createContext<BDMapContextValue>({})

export default class BDMap extends React.Component<BDMapProps, State> {
  public state: State = {
    context: {
      nativeInstance: undefined,
      container: this,
    },
  }
  private el = React.createRef<HTMLDivElement>()
  private map: BMap.Map

  public constructor(props: BDMapProps) {
    super(props)
    if (this.props.apiKey == null) {
      throw new TypeError('BDMap: apiKey is required')
    }
  }

  public componentDidMount() {
    if (window.BMap) {
      this.initializeMap()
      return
    }
    this.loadMap()
  }

  public componentDidUpdate(prevProps: BDMapProps, prevState: State) {
    if (this.map == null) {
      return
    }

    if (this.props.center && this.props.center !== prevProps.center) {
      this.map.centerAndZoom(this.props.center, this.props.zoom || this.props.defaultZoom!)
    }

    settableProperties.forEach(name => {
      const upperName = upperFirst(name)
      // TODO: 处理默认值
      if (this.props[name] !== prevProps[name]) {
        const value = this.props[name]
        const methodName = `set${upperName}`
        if (typeof this.map[methodName] === 'function') {
          this.map[methodName](value)
        }
      }
    })
  }

  public render() {
    const { children, className, style } = this.props
    const { context } = this.state
    // TODO: error display
    return (
      <BDMapContext.Provider value={context}>
        <div className={`bdmap ${className || ''}`} ref={this.el} style={style}>
          {!!context.nativeInstance && children}
        </div>
      </BDMapContext.Provider>
    )
  }

  /**
   * load bdmap in script tag
   */
  private async loadMap() {
    const src = `//api.map.baidu.com/api?v=3.0&ak=${this.props.apiKey}&callback=loadBDMap`
    window.loadBDMap = this.initializeMap
    for (let i = 0; i < DEFAULT_RETRY_TIME; i++) {
      try {
        await importScript(src)
        break
      } catch (error) {
        if (i === DEFAULT_RETRY_TIME - 1) {
          // 加载失败提示
          this.setState({ error: new Error(`Failed to load BDMap: ${error.message}`) })
        }
        await delay(i * 1000)
      }
    }
  }

  /**
   * initialize BDMap instance
   */
  private initializeMap = () => {
    const map = new BMap.Map(this.el.current!, {
      enableMapClick: true,
    })

    // initialize properties
    enablableProperties.forEach(name => {
      const propsName = `enable${upperFirst(name)}`
      if (this.props[propsName] != null) {
        const methodName = this.props[propsName] ? propsName : `disable${upperFirst(name)}`
        if (typeof map[methodName] === 'function') {
          map[methodName]()
        }
      }
    })

    settableProperties.forEach(name => {
      const upperName = upperFirst(name)
      const defaultPropsName = `default${upperName}`
      const value = this.props[name] || this.props[defaultPropsName]
      if (value != null) {
        const methodName = `set${upperName}`
        if (typeof map[methodName] === 'function') {
          map[methodName](value)
        }
      }
    })

    const { zoom, defaultZoom, center, defaultCenter } = this.props
    if (center || defaultCenter) {
      // 必须为BMap.Point 类型才行！
      map.centerAndZoom(center || defaultCenter!, zoom || defaultZoom!)
    }

    // TODO: 支持更多事件
    map.onclick = this.handleClick

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

    // 初始化控件
    // map.addControl(new BMap.GeolocationControl())

    // 清空等待队列
    // setTimeout(() => {
    //   const queue = BDMap.waiterQueue
    //   BDMap.waiterQueue = []
    //   queue.forEach(resolve => resolve())
    // }, 100)

    this.map = map
    this.setState(
      {
        context: {
          nativeInstance: map,
          container: this,
        },
      },
      () => {
        if (this.props.onReady) {
          this.props.onReady(map)
        }
      },
    )
  }

  private handleClick = (event: { point: BMap.Point; pixel: BMap.Pixel; overlay: BMap.Overlay }) => {
    if (this.props.onClick) {
      this.props.onClick(
        {
          lat: event.point.lat,
          lng: event.point.lng,
        },
        event.overlay,
      )
    }
  }
}

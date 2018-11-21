/**
 * Map Container
 */
import React from 'react'
import upperFirst from 'lodash/upperFirst'
import { delay, importScript, isAndroid } from './utils'
import { Coord } from './type'
import { BDMAP_PROPERTIES } from './constants'

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
  /**
   * controlled properties
   */
  defaultZoom?: number
  zoom?: number
  defaultCenter?: BMap.Point
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

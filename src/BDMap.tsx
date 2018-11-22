/**
 * Map Container
 */
import React from 'react'
import upperFirst from 'lodash/upperFirst'
import lowerFirst from 'lodash/lowerFirst'
import { isAndroid } from './utils'
import { BDMAP_PROPERTIES, BDMAP_CUSTOM_EVENT } from './constants'

export interface BDMapProps {
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
   * events from Native Map
   */
  onClick?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel; overlay: BMap.Overlay }) => void
  onDblclick?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onRightclick?: (
    event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel; overlay: BMap.Overlay },
  ) => void
  onRightdblclick?: (
    event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel; overlay: BMap.Overlay },
  ) => void
  onMaptypechange?: (event: { type: string; target: any }) => void
  onMousemove?: (
    event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel; overlay: BMap.Overlay },
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
  onLoad?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel; zoom: number }) => void
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
    Object.keys(this.props).forEach(key => {
      if (key.startsWith('on')) {
        if (this.props[key] !== prevProps[key]) {
          let [, eventName] = key.match(/^on(.*)$/)!
          eventName = lowerFirst(eventName)
          if (BDMAP_CUSTOM_EVENT.indexOf(eventName) === -1) {
            this.map[`on${eventName}`] = this.props[key]
          }
        }
      }
    })
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

  public getInstance(): BMap.Map | undefined {
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
    Object.keys(this.props).forEach(key => {
      if (key.startsWith('on') && typeof this.props[key] === 'function') {
        let [, eventName] = key.match(/^on(.*)$/)!
        eventName = lowerFirst(eventName)
        if (BDMAP_CUSTOM_EVENT.indexOf(eventName) === -1) {
          map[`on${eventName}`] = this.props[key]
        }
      }
    })

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

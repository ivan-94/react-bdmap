import React from 'react'
import debounce from 'lodash/debounce'
import {
  isAndroid,
  initializeEvents,
  initializeSettableProperties,
  initializeEnableableProperties,
  updateEvents,
  override,
  updateEnableableProperties,
  updateSettableProperties,
} from './utils'

export interface BDMapProps {
  className?: string
  style?: React.CSSProperties
  /** onCenterChange debounce 延迟时间 */
  centerChangeDelay?: number

  // enableable properties
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

  // settable properties
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
  /** 设置地图类型。注意，当设置地图类型为BMAP_PERSPECTIVE_MAP时，需要将currentCity方法设置城市 */
  mapType?: BMap.MapType
  /** 设置地图城市，注意当地图初始化时的类型设置为BMAP_PERSPECTIVE_MAP时, 必须设置 */
  currentCity?: string

  // controlled properties
  /** 设置地图的缩放级别 */
  zoom?: number
  /** 设置地图中心点, 必须设置一个初始中心点, 否则百度地图无法正常初始化 */
  center: BMap.Point

  // static properties
  /** 是否启用使用高分辨率地图。在iPhone4及其后续设备上，可以通过开启此选项获取更高分辨率的底图，v1.2,v1.3版本默认不开启，v1.4默认为开启状态 */
  enableHighResolution?: boolean
  /** 是否开启底图可点功能，默认启用 */
  enableMapClick?: boolean

  // events from Native Map
  onClick?: (
    event: {
      type: string
      target: any
      point: BMap.Point
      pixel: BMap.Pixel
      overlay: BMap.Overlay
    },
  ) => void
  onDoubleClick?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onRightClick?: (
    event: {
      type: string
      target: any
      point: BMap.Point
      pixel: BMap.Pixel
      overlay: BMap.Overlay
    },
  ) => void
  onRightDoubleClick?: (
    event: {
      type: string
      target: any
      point: BMap.Point
      pixel: BMap.Pixel
      overlay: BMap.Overlay
    },
  ) => void
  onMapTypeChange?: (event: { type: string; target: any }) => void
  onMouseMove?: (
    event: {
      type: string
      target: any
      point: BMap.Point
      pixel: BMap.Pixel
      overlay: BMap.Overlay
    },
  ) => void
  onMouseOver?: (event: { type: string; target: any }) => void
  onMouseOut?: (event: { type: string; target: any }) => void
  onMoveStart?: (event: { type: string; target: any }) => void
  onMoving?: (event: { type: string; target: any }) => void
  onMoveEnd?: (event: { type: string; target: any }) => void
  onZoomStart?: (event: { type: string; target: any }) => void
  onZoomEnd?: (event: { type: string; target: any }) => void
  onAddOverlay?: (event: { type: string; target: any }) => void
  onAddControl?: (event: { type: string; target: any }) => void
  onRemoveControl?: (event: { type: string; target: any }) => void
  onRemoveOverlay?: (event: { type: string; target: any }) => void
  onClearOverlays?: (event: { type: string; target: any }) => void
  onDragStart?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onDragging?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onDragEnd?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onAddTileLayer?: (event: { type: string; target: any }) => void
  onRemoveTileLayer?: (event: { type: string; target: any }) => void
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
  onHotspotClick?: (event: { type: string; target: any; spots: BMap.HotspotOptions }) => void
  onHotspotOver?: (event: { type: string; target: any; spots: BMap.HotspotOptions }) => void
  onHotspotOut?: (event: { type: string; target: any; spots: BMap.HotspotOptions }) => void
  onTilesLoaded?: (event: { type: string; target: any }) => void
  onTouchStart?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onTouchMove?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onTouchEnd?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onLongPress?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void

  // Custom events
  /** 缩放级别变动. 和zoom配合实现受控模式  */
  onZoomChange?: (zoom: number) => void
  /** 中心点变动. 和center配合实现受控模式. 可以使用centerChangeDelay设置debounce延迟  */
  onCenterChange?: (center: BMap.Point) => void
}

export interface BDMapContextValue {
  nativeInstance?: BMap.Map
  container?: BDMap
}

interface State {
  ready?: boolean
  context: BDMapContextValue
}

const BDMAP_ENABLEABLE_PROPERTIES = [
  'dragging',
  'scrollWheelZoom',
  'doubleClickZoom',
  'keyboard',
  'inertialDragging',
  'continuousZoom',
  'pinchToZoom',
  'autoResize',
]

const BDMAP_SETTABLE_PROPERTIES = [
  'defaultCursor',
  'draggingCursor',
  'minZoom',
  'maxZoom',
  'mapStyle',
  'mapStyleV2',
  'panorama',
  'mapType',
  'currentCity',
  'zoom',
  'center',
]

const BDMAP_EVENTS = [
  'click',
  'dbl_click',
  'right_click',
  'right_dbl_click',
  'map_type_change',
  'mouse_move',
  'mouse_over',
  'mouse_out',
  'move_start',
  'moving',
  'move_end',
  'zoom_start',
  'zoom_end',
  'add_overlay',
  'add_control',
  'remove_control',
  'remove_overlay',
  'clear_overlays',
  'drag_start',
  'dragging',
  'drag_end',
  'add_tile_layer',
  'remove_tile_layer',
  'load',
  'resize',
  'hotspot_click',
  'hotspot_over',
  'hotspot_out',
  'tiles_loaded',
  'touch_start',
  'touch_move',
  'touch_end',
  'long_press',
]

export const BDMapContext = React.createContext<BDMapContextValue>({})

/**
 * 这是Baidu地图的核心组件, 表示一个地图实例. 所有控件, 覆盖物, 图层都是在这个上下文中进行渲染
 */
export default class BDMap extends React.Component<BDMapProps, State> {
  public static defaultProps: Partial<BDMapProps> = {
    enableDragging: true,
    enableDoubleClickZoom: true,
    enablePinchToZoom: true,
    enableAutoResize: true,
    zoom: 18,
  }

  public state: State = {
    context: {
      nativeInstance: undefined,
      container: this,
    },
    ready: false,
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

    updateEnableableProperties(BDMAP_ENABLEABLE_PROPERTIES, this.map, this.props, prevProps)
    updateSettableProperties(BDMAP_SETTABLE_PROPERTIES, this.map, this.props, prevProps)

    // update eventListeners
    updateEvents(BDMAP_EVENTS, this.map, this.props, prevProps, this)
  }

  public render() {
    const { children, className, style } = this.props
    const { context } = this.state
    return (
      <BDMapContext.Provider value={context}>
        <div className={`bdmap ${className || ''}`} ref={this.el} style={style} />
        {this.state.ready && !!context.nativeInstance && children}
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
   * 返回地图可视区域，以地理坐标表示
   */
  public getBounds() {
    return this.map.getBounds()
  }

  /**
   * 返回地图视图的大小，以像素表示
   */
  public getSize() {
    return this.map.getSize()
  }

  /**
   * 返回两点之间的距离，单位是米
   */
  public getDistance(start: BMap.Point, end: BMap.Point) {
    return this.map.getDistance(start, end)
  }

  /**
   * 根据提供的地理区域或坐标设置地图视野，调整后的视野会保证包含提供的地理区域或坐标
   */
  public setViewport(view: BMap.Point[] | BMap.Viewport, options?: BMap.ViewportOptions) {
    // @ts-ignore
    this.map.setViewport(view, options)
  }

  /**
   * 将地图的中心点更改为给定的点。如果该点在当前的地图视图中已经可见，则会以平滑动画的方式移动到中心点位置。可以通过配置强制移动过程不使用动画效果
   */
  public panTo(center: BMap.Point, opts?: BMap.PanOptions) {
    this.map.panTo(center, opts)
  }

  /**
   * 将地图在水平位置上移动x像素，垂直位置上移动y像素。如果指定的像素大于可视区域范围或者在配置中指定没有动画效果，则不执行滑动效果
   */
  public panBy(x: number, y: number, opts?: BMap.PanOptions) {
    this.map.panBy(x, y, opts)
  }

  /**
   * 放大一级视图
   */
  public zoomIn() {
    this.map.zoomIn()
  }

  /**
   * 缩小一级视图
   */
  public zoomOut() {
    this.map.zoomOut()
  }

  /**
   * 根据地理坐标获取对应的覆盖物容器的坐标，此方法用于自定义覆盖物
   */
  public pointToOverlayPixel(point: BMap.Point) {
    return this.map.pointToOverlayPixel(point)
  }

  /**
   * pixel 根据覆盖物容器的坐标获取对应的地理坐标
   */
  public overlayPixelToPoint(pixel: BMap.Pixel) {
    return this.map.overlayPixelToPoint(pixel)
  }

  /**
   * 像素坐标转换为经纬度坐标
   */
  public pixelToPoint(pixel: BMap.Pixel) {
    return this.map.pixelToPoint(pixel)
  }

  /**
   * 经纬度坐标转换为像素坐标
   */
  public pointToPixel(point: BMap.Point) {
    return this.map.pointToPixel(point)
  }

  /**
   * initialize BDMap instance
   */
  private initializeMap = () => {
    const { enableMapClick, enableHighResolution } = this.props
    const map = (this.map = new BMap.Map(this.el.current!, {
      enableMapClick,
      enableHighResolution,
    }))

    initializeEnableableProperties(BDMAP_ENABLEABLE_PROPERTIES, map, this.props)

    initializeSettableProperties(BDMAP_SETTABLE_PROPERTIES, map, this.props)

    // initialize events
    initializeEvents(BDMAP_EVENTS, this.map, this.props, this)

    map.reset()
    // 我的家乡, Baidu地图必须在初始化时调用centerAndZoom
    const center = this.props.center || new BMap.Point(115.532177, 22.745408)
    map.centerAndZoom(center, this.props.zoom!)

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

    this.setState({
      context: {
        nativeInstance: map,
        container: this,
      },
    })
  }

  protected handleZoomEnd = override('onZoomEnd', (evt: any) => {
    if (this.props.onZoomChange) {
      this.props.onZoomChange(this.map.getZoom())
    }

    if (this.props.onCenterChange) {
      this.triggerCenterChange()
    }
  })

  protected handleMoveEnd = override('onMoveEnd', () => {
    if (this.props.onCenterChange) {
      this.triggerCenterChange()
    }
  })

  protected handleLoad = override('onLoad', () => {
    this.setState({ ready: true })
  })

  private triggerCenterChange = debounce(() => {
    this.props.onCenterChange!(this.map.getCenter())
  }, this.props.centerChangeDelay || 50)
}

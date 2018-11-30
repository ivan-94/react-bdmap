/**
 * TODO: 优化path的更新性能
 */
import Overlay from './Overlay'
import { override } from '../utils'

export interface PolygonProps {
  /**
   * 设置多边型的点数组
   */
  path: BMap.Point[]
  /**
   * 设置多边型的边线颜色，参数为合法的CSS颜色值
   */
  strokeColor?: string
  /**
   * 设置多边形的填充颜色，参数为合法的CSS颜色值。当参数为空字符串时，折线覆盖物将没有填充效果
   */
  fillColor?: string
  /** 设置多边形的填充透明度，取值范围0 - 1 */
  fillOpacity?: number
  /** 设置多边形的边线透明度，取值范围0 - 1 */
  strokeOpacity?: number
  /** 设置多边形边线的宽度，取值为大于等于1的整数 */
  strokeWeight?: number
  /** 设置多边形边线样式为实线或虚线，取值solid或dashed */
  strokeStyle?: string

  /** 开启编辑功能 */
  enableEditing?: boolean
  /** 允许覆盖物在map.clearOverlays方法中被清除 */
  enableMassClear?: boolean

  /** 是否响应点击事件，默认为true. 不能动态修改 */
  enableClicking?: boolean

  onClick?: (event: { type: string; target: any }) => void
  onDoubleClick?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseDown?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseUp?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseOut?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseOver?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onRemove?: (event: { type: string; target: any }) => void
  onLineUpdate?: (event: { type: string; target: any }) => void
  /** 路径变动 */
  onChange?: (path: BMap.Point[]) => void
}

const PROPERTIES = ['path', 'strokeColor', 'fillColor', 'fillOpacity', 'strokeOpacity', 'strokeWeight', 'strokeStyle']
const ENABLEABLE_PROPERTIES = ['editing', 'massClear']
const EVENTS = ['click', 'dbl_click', 'mouse_down', 'mouse_up', 'mouse_out', 'mouse_over', 'remove', 'line_update']

/**
 * 表示一个多边形覆盖物
 * @visibleName 多边形 - Polygon
 */
export default class Polygon extends Overlay<PolygonProps> {
  public static defaultProps = {
    enableEditing: false,
    enableMassClear: true,
  }

  public constructor(props: PolygonProps) {
    super(props)
    this.extendedProperties = PROPERTIES
    this.extendedEnableableProperties = ENABLEABLE_PROPERTIES
    this.extendedEvents = EVENTS
    const { path = [], enableClicking } = this.props

    this.instance = new BMap.Polygon(path, { enableClicking })
  }

  public getBounds() {
    return (this.instance as BMap.Polygon).getBounds()
  }

  protected getPosition() {
    return this.props.path && this.props.path[0]
  }

  protected handleLineUpdate = override('onLineUpdate', (evt: any) => {
    if (this.props.onChange) {
      const path = (this.instance as BMap.Polygon).getPath()
      this.props.onChange(path)
    }
  })
}

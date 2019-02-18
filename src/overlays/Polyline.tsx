/**
 * TODO: 优化path的更新性能
 */
import Overlay from './Overlay'
import { override } from '../utils'

export interface PolylineProps {
  /**
   * 设置折线的点数组
   */
  path: BMap.Point[]
  /**
   * 设置折线的颜色
   */
  strokeColor?: string
  /**
   * 设置透明度，取值范围0 - 1
   */
  strokeOpacity?: number
  /**
   * 设置线的宽度，范围为大于等于1的整数
   */
  strokeWeight?: number
  /**
   * 设置是为实线或虚线，solid或dashed
   */
  strokeStyle?: string

  /**
   * 开启编辑功能
   */
  enableEditing?: boolean
  /**
   * 允许覆盖物在map.clearOverlays方法中被清除
   */
  enableMassClear?: boolean
  /**
   * 是否响应点击事件，默认为true. 不能动态更改
   */
  enableClicking?: boolean

  onChange?: (path: BMap.Point[]) => void
  onClick?: (event: { type: string; target: BMap.Polyline }) => void
  onDoubleClick?: (event: { type: string; target: BMap.Polyline; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseDown?: (event: { type: string; target: BMap.Polyline; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseUp?: (event: { type: string; target: BMap.Polyline; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseOut?: (event: { type: string; target: BMap.Polyline; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseOver?: (event: { type: string; target: BMap.Polyline; point: BMap.Point; pixel: BMap.Pixel }) => void
  onRemove?: (event: { type: string; target: BMap.Polyline }) => void
  onLineUpdate?: (event: { type: string; target: BMap.Polyline }) => void
}

const PROPERTIES = ['path', 'strokeColor', 'strokeOpacity', 'strokeWeight', 'strokeStyle']
const FORCE_RELOAD_PROPERTIES = ['path']
const ENABLEABLE_PROPERTIES = ['editing', 'massClear']
const EVENTS = ['click', 'dbl_click', 'mouse_down', 'mouse_up', 'mouse_out', 'mouse_over', 'remove', 'line_update']

/**
 * 使用浏览器的矢量制图工具（如果可用）在地图上绘制折线的地图叠加层
 * @visibleName 折线 - Polyline
 */
export default class Polyline extends Overlay<PolylineProps> {
  public static defaultProps = {
    enableEditing: false,
    enableMassClear: true,
  }

  public constructor(props: PolylineProps) {
    super(props)
    this.extendedProperties = PROPERTIES
    this.extendedEnableableProperties = ENABLEABLE_PROPERTIES
    this.extendedForceReloadProperties = FORCE_RELOAD_PROPERTIES
    this.extendedEvents = EVENTS
    const { path = [], enableClicking } = this.props

    this.instance = new BMap.Polyline(path, { enableClicking })
  }

  public getBounds() {
    return (this.instance as BMap.Polyline).getBounds()
  }

  protected handleLineUpdate = override('onLineUpdate', (evt: any) => {
    if (this.props.onChange) {
      const path = (this.instance as BMap.Polyline).getPath()
      this.props.onChange(path)
    }
  })
}

import Overlay from './Overlay'

export interface CircleProps {
  /**
   * 设置圆形的中心点坐标
   */
  center: BMap.Point
  /**
   * 设置圆形的半径，单位为米
   */
  radius: number
  /**
   * 设置圆形的边线颜色，参数为合法的CSS颜色值
   */
  strokeColor?: string
  /**
   * 设置圆形的填充颜色，参数为合法的CSS颜色值。当参数为空字符串时，圆形覆盖物将没有填充效果
   */
  fillColor?: string
  /**
   * 设置圆形的填充透明度，取值范围0 - 1
   */
  fillOpacity?: number
  /**
   * 设置圆形的边线透明度，取值范围0 - 1
   */
  strokeOpacity?: number
  /**
   * 设置圆形边线的宽度，取值为大于等于1的整数
   */
  strokeWeight?: number
  /**
   * 设置圆形边线样式为实线或虚线，取值solid或dashed
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
   * 是否响应点击事件，默认为true. 在组件挂载时设置
   */
  enableClicking?: boolean

  onClick?: (event: { type: string; target: any }) => void
  onDoubleClick?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseDown?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseUp?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseOut?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseOver?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onRemove?: (event: { type: string; target: any }) => void
  onLineUpdate?: (event: { type: string; target: any }) => void
}

const PROPERTIES = [
  'center',
  'radius',
  'strokeColor',
  'fillColor',
  'fillOpacity',
  'strokeOpacity',
  'strokeWeight',
  'strokeStyle',
]
const ENABLEABLE_PROPERTIES = ['editing', 'massClear']
const EVENTS = ['click', 'dbl_click', 'mouse_down', 'mouse_up', 'mouse_out', 'mouse_over', 'remove', 'line_update']

/**
 * 表示地图上的圆覆盖物
 * @visibleName 圆 - Circle
 */
export default class Circle extends Overlay<CircleProps> {
  public static defaultProps = {
    enableEditing: false,
    enableMassClear: true,
  }

  public constructor(props: CircleProps) {
    super(props)
    this.extendedProperties = PROPERTIES
    this.extendedEnableableProperties = ENABLEABLE_PROPERTIES
    this.extendedEvents = EVENTS
    const { center, radius, enableClicking } = this.props

    this.instance = new BMap.Circle(center, radius, { enableClicking })
  }

  public getBounds() {
    return (this.instance as BMap.Circle).getBounds()
  }

  protected getPosition = () => {
    return this.props.center
  }
}

/**
 * 表示一个多边形覆盖物
 * TODO: 优化path的更新性能
 */
import Overlay from './Overlay'

export interface PolygonProps {
  path: BMap.Point[]
  strokeColor?: string
  fillColor?: string
  fillOpacity?: number
  strokeOpacity?: number
  strokeWeight?: number
  strokeStyle?: string

  enableEditing?: boolean
  enableMassClear?: boolean

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

const PROPERTIES = ['path', 'strokeColor', 'fillColor', 'fillOpacity', 'strokeOpacity', 'strokeWeight', 'strokeStyle']
const ENABLEABLE_PROPERTIES = ['editing', 'massClear']
const EVENTS = ['click', 'dbl_click', 'mouse_down', 'mouse_up', 'mouse_out', 'mouse_over', 'remove', 'line_update']

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

  protected getPosition() {
    return this.props.path && this.props.path[0]
  }
}

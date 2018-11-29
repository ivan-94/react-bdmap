/**
 * 使用浏览器的矢量制图工具（如果可用）在地图上绘制折线的地图叠加层
 * TODO: 优化path的更新性能
 */
import Overlay from './Overlay'

export interface PolylineProps {
  path: BMap.Point[]
  strokeColor?: string
  strokeOpacity?: number
  strokeWeight?: number
  strokeStyle?: string

  enableEditing?: boolean
  enableMassClear?: boolean

  enableClicking?: boolean

  onClick: (event: { type: string; target: any }) => void
  onDoubleClick: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseDown: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseUp: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseOut: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseOver: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onRemove: (event: { type: string; target: any }) => void
  onLineUpdate: (event: { type: string; target: any }) => void
}

const PROPERTIES = ['path', 'strokeColor', 'strokeOpacity', 'strokeWeight', 'strokeStyle']
const ENABLEABLE_PROPERTIES = ['editing', 'massClear']
const EVENTS = ['click', 'dbl_click', 'mouse_down', 'mouse_up', 'mouse_out', 'mouse_over', 'remove', 'line_update']

export default class Polyline extends Overlay<PolylineProps> {
  public static defaultProps: Partial<PolylineProps> = {
    enableEditing: false,
    enableMassClear: true,
  }

  public constructor(props: PolylineProps) {
    super(props)
    this.extendedProperties = PROPERTIES
    this.extendedEnableableProperties = ENABLEABLE_PROPERTIES
    this.extendedEvents = EVENTS
    const { path = [], enableClicking } = this.props

    this.instance = new BMap.Polyline(path, { enableClicking })
  }

  protected getPosition() {
    return this.props.path && this.props.path[0]
  }
}

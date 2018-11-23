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

  onClick: (event: { type: string; target: any }) => void
  onDblclick: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMousedown: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseup: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseout: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseover: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onRemove: (event: { type: string; target: any }) => void
  onLineupdate: (event: { type: string; target: any }) => void
}

const PROPERTIES = [
  'path',
  'strokeColor',
  'fillColor',
  'fillOpacity',
  'strokeOpacity',
  'strokeWeight',
  'strokeStyle',
]
const ENABLEABLE_PROPERTIES = ['editing', 'massClear']
const EVENTS = [
  'click',
  'dblclick',
  'mousedown',
  'mouseup',
  'mouseout',
  'mouseover',
  'remove',
  'lineupdate',
]

export default class Polygon extends Overlay<PolygonProps> {
  public static defaultProps: Partial<PolygonProps> = {
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

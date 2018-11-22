/**
 * 表示地图上的圆覆盖物
 */
import Overlay from './Overlay'

export interface CircleProps {
  center: BMap.Point
  radius: number
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
const EVENTS = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseout', 'mouseover', 'remove', 'lineupdate']

export default class Circle extends Overlay<CircleProps> {
  public static defaultProps: Partial<CircleProps> = {
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
}

/**
 * 表示地图上一个图像标注
 */
import Overlay from './Overlay'

export interface MarkerProps {
  position: BMap.Point
  onChange?: (position: BMap.Point) => void

  icon?: BMap.Icon
  shadow?: BMap.Icon
  offset?: BMap.Size
  title?: string
  top?: boolean
  label?: BMap.Label
  zIndex?: number
  animation?: BMap.Animation
  rotation?: number

  // enableable properties
  enableDragging?: boolean
  enableMassClear?: boolean

  // enabled in initialize
  enableClicking?: boolean
  raiseOnDrag?: boolean
  draggingCursor?: string

  // events
  onClick: (event: { type: string; target: any }) => void
  onDblclick: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMousedown: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseup: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseout: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseover: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onRemove: (event: { type: string; target: any }) => void
  onInfowindowclose: (event: { type: string; target: any }) => void
  onInfowindowopen: (event: { type: string; target: any }) => void
  onDragstart: (event: { type: string; target: any }) => void
  onDragging: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onDragend: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onRightclick: (event: { type: string; target: any }) => void
}

const PROPERTIES = ['position', 'icon', 'shadow', 'offset', 'title', 'top', 'label', 'zIndex', 'animation', 'rotation']
const ENABLEABLE_PROPERTIES = ['dragging', 'massClear']
const EVENTS = [
  'click',
  'dblclick',
  'mousedown',
  'mouseup',
  'mouseout',
  'mouseover',
  'remove',
  'infowindowclose',
  'infowindowopen',
  'dragstart',
  'dragging',
  'dragend',
  'rightclick',
]

export default class Marker extends Overlay<MarkerProps> {
  public static defaultProps: Partial<MarkerProps> = {
    enableDragging: false,
    enableMassClear: true,
  }

  public constructor(props: MarkerProps) {
    super(props)
    const { position, enableClicking, raiseOnDrag, draggingCursor } = this.props
    this.extendedProperties = PROPERTIES
    this.extendedEnableableProperties = ENABLEABLE_PROPERTIES
    this.extendedEvents = EVENTS

    this.instance = new BMap.Marker(position, {
      enableClicking,
      raiseOnDrag,
      draggingCursor,
    })
  }

  protected handleDragend = (evt: any) => {
    const newPosition = (this.instance as BMap.Marker).getPosition()
    if (this.props.onDragend) {
      this.props.onDragend(evt)
    }

    if (this.props.onChange) {
      this.props.onChange(newPosition)
    }
  }
}

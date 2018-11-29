/**
 * 表示地图上一个图像标注
 */
import Overlay from './Overlay'
import { override } from '../utils'

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
  onDoubleClick: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseDown: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseUp: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseOut: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseOver: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onRemove: (event: { type: string; target: any }) => void
  onInfoWindowClose: (event: { type: string; target: any }) => void
  onInfoWindowOpen: (event: { type: string; target: any }) => void
  onDragStart: (event: { type: string; target: any }) => void
  onDragging: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onDragEnd: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onRightClick: (event: { type: string; target: any }) => void
}

const PROPERTIES = ['position', 'icon', 'shadow', 'offset', 'title', 'top', 'label', 'zIndex', 'animation', 'rotation']
const ENABLEABLE_PROPERTIES = ['dragging', 'massClear']
const EVENTS = [
  'click',
  'dbl_click',
  'mouse_down',
  'mouse_up',
  'mouse_out',
  'mouse_over',
  'remove',
  'info_window_close',
  'info_window_open',
  'drag_start',
  'dragging',
  'drag_end',
  'right_click',
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

  protected handleDragEnd = override('onDragEnd', (evt: any) => {
    const newPosition = (this.instance as BMap.Marker).getPosition()

    if (this.props.onChange) {
      this.props.onChange(newPosition)
    }
  })

  protected getPosition() {
    return this.props.position
  }
}

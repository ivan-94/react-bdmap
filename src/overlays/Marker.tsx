/**
 * TODO: 子节点允许Icon，Label
 */
import Overlay from './Overlay'
import { override } from '../utils'

export interface MarkerProps {
  /** 设置标注的地理坐标 */
  position: BMap.Point
  /** 坐标变动 */
  onChange?: (position: BMap.Point) => void

  /** 设置标注所用的图标对象 */
  icon?: BMap.Icon
  /** 阴影图标 */
  shadow?: BMap.Icon
  /** 设置标注的偏移值 */
  offset?: BMap.Size
  /** 设置标注的标题，当鼠标移至标注上时显示此标题 */
  title?: string
  /** 将标注置于其他标注之上。默认情况下，纬度较低的标注会覆盖在纬度较高的标注之上，从而形成一种立体效果。
   * 通过此方法可使某个标注覆盖在其他所有标注之上。注意：如果在多个标注对象上调用此方法，
   * 则这些标注依旧按照纬度产生默认的覆盖效果
   */
  top?: boolean
  /** 为标注添加文本标注 */
  label?: BMap.Label
  /** 设置覆盖物的zIndex */
  zIndex?: number
  /** 设置标注动画效果。如果参数为null，则取消动画效果。该方法需要在addOverlay方法后设置 */
  animation?: BMap.Animation
  /** 设置点的旋转角度 */
  rotation?: number

  // enableable properties
  /** 开启标注拖拽功能 */
  enableDragging?: boolean
  /** 允许覆盖物在map.clearOverlays方法中被清除 */
  enableMassClear?: boolean

  // enabled in initialize
  /** 是否响应点击事件。默认为true */
  enableClicking?: boolean
  /** 拖拽标注时，标注是否开启离开地图表面效果。默认为false */
  raiseOnDrag?: boolean
  /** 拖拽标注时的鼠标指针样式。此属性值需遵循CSS的cursor属性规范 */
  draggingCursor?: string

  // events
  onClick?: (event: { type: string; target: any }) => void
  onDoubleClick?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseDown?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseUp?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseOut?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onMouseOver?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onRemove?: (event: { type: string; target: any }) => void
  onInfoWindowClose?: (event: { type: string; target: any }) => void
  onInfoWindowOpen?: (event: { type: string; target: any }) => void
  onDragStart?: (event: { type: string; target: any }) => void
  onDragging?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onDragEnd?: (event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }) => void
  onRightClick?: (event: { type: string; target: any }) => void
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

/**
 * 表示地图上一个图像标注
 * @visibleName 点标注 - Marker
 */
export default class Marker extends Overlay<MarkerProps> {
  public static defaultProps = {
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

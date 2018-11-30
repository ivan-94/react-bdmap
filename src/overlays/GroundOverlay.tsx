import Overlay from './Overlay'

export interface GroundOverlayProps {
  /**
   * 表示地理坐标的矩形区域, 一般通过指定西南角和东北角来确定
   */
  bounds: BMap.Bounds
  /** 图片链接 */
  imageURL: string
  /** 设置图层的透明度 */
  opacity?: number
  /** 设置图层显示的最小级别 */
  displayOnMinLevel?: number
  /** 设置图层显示的最大级别 */
  dispalyOnMaxLevel?: number

  onClick?: (event: { type: string; target: any }) => void
  onDoubleClick?: (event: { type: string; target: any }) => void
}

const PROPERTIES = ['bounds', 'imageURL', 'opacity', 'displayOnMinLevel', 'dispalyOnMaxLevel']
const EVENTS = ['click', 'dbl_click']

/**
 * 表示地图上的地面叠加层, 即在地图上叠加图片
 * @visibleName 地面叠加层 - GroundOverlay
 */
export default class GroundOverlay extends Overlay<GroundOverlayProps> {
  public constructor(props: GroundOverlayProps) {
    super(props)
    this.extendedProperties = PROPERTIES
    this.extendedEvents = EVENTS
    const { bounds } = this.props
    this.instance = new BMap.GroundOverlay(bounds)
  }

  protected getPosition() {
    return undefined
  }
}

import Overlay from './Overlay'

export interface PointCollectionProps {
  /** 设置要在地图上展示的点坐标集合 */
  points: BMap.Point[]
  /** 点的样式，包括:大小"size"（可选,默认正常尺寸10*10px，SizeType类型），形状"shape"（可选，默认圆形，ShapeType类型），颜色"color"（可选，字符串类型） */
  styles: BMap.PointCollectionOption

  onClick?: (event: { type: string; target: any; point: BMap.Point }) => void
  onMouseOver?: (event: { type: string; target: any; point: BMap.Point }) => void
  onMouseOut?: (event: { type: string; target: any; point: BMap.Point }) => void
}

const PROPERTIES = ['points', 'styles']
const EVENTS = ['click', 'mouse_out', 'mouse_over']

/**
 * 此类表示海量点类，利用该类可同时在地图上展示万级别的点，目前仅适用于html5浏览器.<br/><br/>
 *
 * Note: 渲染海量点会耗费一定性能，应该注意不要频繁变动point数组
 */
export default class PointCollection extends Overlay<PointCollectionProps> {
  public constructor(props: PointCollectionProps) {
    super(props)
    this.extendedProperties = PROPERTIES
    this.extendedEvents = EVENTS
    const { points } = this.props

    this.instance = new BMap.PointCollection(points)
  }

  protected getPosition() {
    return undefined
  }
}

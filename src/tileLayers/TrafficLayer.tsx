import TileLayer from './TileLayer'

export interface TrafficLayerProps {
  /**
   * 预测日期, 如果提供predictDate，则将显示预测流量。否则显示实时流量
   */
  predictDate?: BMap.PredictDate
}

/**
 * 表示交通流量图层, 继承TileLayer
 * @visibleName 交通流量图层 - TrafficLayer
 */
export default class TrafficLayer extends TileLayer<TrafficLayerProps> {
  public constructor(props: TrafficLayerProps) {
    super(props)
    const { predictDate } = this.props
    this.instance = new BMap.TrafficLayer({ predictDate })
  }
}

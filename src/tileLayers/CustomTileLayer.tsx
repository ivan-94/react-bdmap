import TileLayer from './TileLayer'

export interface CustomTileLayerProps {
  /**
   * 地图图层的版权信息
   */
  copyright?: BMap.Copyright
  /**
   * 图层的zIndex
   */
  zIndex?: number
  /**
   * 向地图返回地图图块的网址，图块索引由tileCoord的x和y属性在指定的缩放级别zoom提供
   */
  getTilesUrl: (tileCoord: BMap.Pixel, zoom: number) => string
}

/**
 * 自定义图层
 */
export default class CustomTileLayer extends TileLayer<CustomTileLayerProps> {
  public constructor(props: CustomTileLayerProps) {
    super(props)
    const { copyright, zIndex, getTilesUrl } = this.props
    this.instance = new BMap.TileLayer({ copyright, zIndex })
    this.instance.getTilesUrl = getTilesUrl
  }
}

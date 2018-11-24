import TileLayer from './TileLayer'
import omit from 'lodash/omit'

export interface CustomTileLayerProps {
  /** 使用云检索v1版本的databoxId */
  databoxId?: string
  /** 使用云检索v2版本的geotableId  */
  geotableId?: string
  /** 检索关键字 */
  q?: string
  /** 空格分隔的多字符串 */
  tags?: string
  /** 过滤条件,参考http://developer.baidu.com/map/lbs-geosearch.htm#.search.nearby */
  filter?: string
  /** 麻点密度常量 */
  pointDensityType?: BMap.PointDensityType
  /** 点击热区触发，content即为lbs云详情检索的所有字段，参考http://developer.baidu.com/map/lbs-geosearch.htm#.search.detail */
  onHotspotclick: (event: { type: string; target: any; content: any }) => void
}

/**
 * 用户自定义底图层，现阶段主要为LBS云麻点功能展现服务。
 */
export default class CustomTileLayer extends TileLayer<CustomTileLayerProps> {
  public constructor(props: CustomTileLayerProps) {
    super(props)
    const options = omit(this.props, ['onHotspotclick'])
    this.instance = new BMap.CustomLayer(options)
    ;(this
      .instance as BMap.CustomLayer).onhotspotclick = this.handleHotSpotClick.bind(
      this,
    )
  }

  private handleHotSpotClick(evt: any) {
    if (this.props.onHotspotclick) {
      this.props.onHotspotclick(evt)
    }
  }
}

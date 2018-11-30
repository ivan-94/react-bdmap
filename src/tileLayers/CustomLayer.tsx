import TileLayer from './TileLayer'
import omit from 'lodash/omit'
import equal from 'shallowequal'

export interface CustomLayerProps {
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
  onHotspotClick?: (event: { type: string; target: any; content: any }) => void
}

const PROPS_TO_OMIT = ['onHotspot_click']

/**
 * 用户自定义底图层，现阶段主要为LBS云麻点功能展现服务。
 */
export default class CustomLayer extends TileLayer<CustomLayerProps> {
  public constructor(props: CustomLayerProps) {
    super(props)
    this.setUpCustomLayer()
  }

  public shouldComponentUpdate(nextProps: CustomLayerProps) {
    const currentOptions = omit(this.props, PROPS_TO_OMIT)
    const nextOptions = omit(nextProps, PROPS_TO_OMIT)
    return !equal(currentOptions, nextOptions)
  }

  /**
   * CustomLayer和其他组件不一样，当props变动时会重新实例化对象。触发从云端检索数据
   */
  public componentDidUpdate(preProps: CustomLayerProps) {
    this.context.nativeInstance!.removeTileLayer(this.instance)
    this.setUpCustomLayer()
    this.context.nativeInstance!.addTileLayer(this.instance)
  }

  private setUpCustomLayer() {
    const options = omit(this.props, ['onHotspotclick'])
    this.instance = new BMap.CustomLayer(options)
    ;(this.instance as BMap.CustomLayer).onhotspotclick = this.handleHotSpotClick.bind(this)
  }

  private handleHotSpotClick(evt: any) {
    if (this.props.onHotspotClick) {
      this.props.onHotspotClick(evt)
    }
  }
}

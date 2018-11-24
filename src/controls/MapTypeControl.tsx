/**
 * 表示比例尺控件
 */
import Control from './Control'

export interface MapTypeControlProps {
  // 控件样式
  type?: BMap.MapTypeControlType
  // 控件展示的地图类型，默认为普通图、卫星图、卫星加路网混合图和三维图。通过此属性可配置控件展示的地图类型
  mapTypes?: BMap.MapType[]
}

export default class MapTypeControl extends Control<MapTypeControlProps> {
  public componentDidMount() {
    const { type, mapTypes } = this.props
    this.instance = new BMap.MapTypeControl({ type, mapTypes })
    this.context.nativeInstance!.addControl(this.instance)
    this.initialProperties()
  }
}

import Control, { ControlProps } from './Control'

export interface MapTypeControlProps extends ControlProps {
  /**
   * 控件样式, 可选值有: <br/>
   * - BMAP\_MAPTYPE\_CONTROL\_HORIZONTAL: 按钮水平方式展示，默认采用此类型展示<br/>
   * - BMAP\_MAPTYPE\_CONTROL\_DROPDOWN: 按钮呈下拉列表方式展示<br/>
   * - BMAP\_MAPTYPE\_CONTROL\_MAP: 以图片方式展示类型控件，设置该类型后无法指定maptypes属性<br/>
   */
  type?: BMap.MapTypeControlType
  /**
   * 控件展示的地图类型，默认为普通图、卫星图、卫星加路网混合图和三维图。通过此属性可配置控件展示的地图类型, 例如: <br/>
   * - BMAP\_NORMAL\_MAP: 此地图类型展示普通街道视图<br/>
   * - BMAP\_PERSPECTIVE\_MAP: 此地图类型展示透视图像视图<br/>
   * - BMAP\_SATELLITE\_MAP: 此地图类型展示卫星视图<br/>
   * - BMAP\_HYBRID\_MAP: 此地图类型展示卫星和路网的混合视图<br/>
   * <br/>
   * 另外还支持自定义图层, 详见官方文档
   */
  mapTypes?: BMap.MapType[]
}

/**
 * 表示负责切换地图类型的控件，默认位于地图右上方
 * @visibleName 地图类型控件
 */
export default class MapTypeControl extends Control<MapTypeControlProps> {
  public constructor(props: any) {
    super(props)

    const { type, mapTypes } = this.props
    this.instance = new BMap.MapTypeControl({ type, mapTypes })
  }
}

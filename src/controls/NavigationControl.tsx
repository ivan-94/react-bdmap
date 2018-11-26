import Control, { ControlProps } from './Control'

export interface NavigationControlProps extends ControlProps {
  /** 是否显示级别提示信息 */
  showZoomInfo?: boolean
  /** 控件是否集成定位功能，默认为false */
  enableGeolocation?: boolean
  /**
   * 平移缩放控件的类型, 可选值有:<br/>
   * - BMAP\_NAVIGATION\_CONTROL\_LARGE: 标准的平移缩放控件（包括平移、缩放按钮和滑块） <br/>
   * - BMAP\_NAVIGATION\_CONTROL\_SMALL: 仅包含平移和缩放按钮<br/>
   * - BMAP\_NAVIGATION\_CONTROL\_PAN: 仅包含平移按钮<br/>
   * - BMAP\_NAVIGATION\_CONTROL\_ZOOM: 仅包含缩放按钮
   */
  type?: BMap.NavigationControlType
}

const CONTROL_PROPERTIES = ['type']

/**
 * 表示地图的平移缩放控件，可以对地图进行上下左右四个方向的平移和缩放操作.
 * PC端默认位于地图左上方，它包含控制地图的平移和缩放的功能。移动端提供缩放控件，默认位于地图右下方
 * @visibleName 平移缩放控件
 */
export default class NavigationControl extends Control<NavigationControlProps> {
  public constructor(props: any) {
    super(props)

    this.extendedProperties = CONTROL_PROPERTIES
    const { showZoomInfo, enableGeolocation } = this.props
    this.instance = new BMap.NavigationControl({
      showZoomInfo,
      enableGeolocation,
    })
  }
}

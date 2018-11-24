/**
 * 表示地图的平移缩放控件，可以对地图进行上下左右四个方向的平移和缩放操作
 */
import Control from './Control'

export interface NavigationControlProps {
  showZoomInfo?: boolean
  enableGeolocation?: boolean
  type?: BMap.NavigationControlType
}

const NAVIGATION_CONTROL_PROPERTIES = ['type']

export default class NavigationControl extends Control<NavigationControlProps> {
  public componentDidMount() {
    this.extendedProperties = NAVIGATION_CONTROL_PROPERTIES
    const { showZoomInfo, enableGeolocation } = this.props
    this.instance = new BMap.NavigationControl({
      showZoomInfo,
      enableGeolocation,
    })
    this.context.nativeInstance!.addControl(this.instance)
    this.initialProperties()
  }
}

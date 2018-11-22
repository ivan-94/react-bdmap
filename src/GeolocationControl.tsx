/**
 * 针对移动端开发，默认位于地图左下方
 */
import Control from './Control'

export interface GeolocationControlProps {
  // 是否显示定位信息面板。默认显示定位信息面板
  showAddressBar?: boolean
  // 添加控件时是否进行定位。默认添加控件时不进行定位
  enableAutoLocation?: boolean
  // TODO: icon
  onLocationSuccess?: (evt: { point: BMap.Point }) => void
  onLocationError?: (error: {}) => void
}

const CONTROL_EVENTS = ['LocationSuccess', 'LocationError']

export default class GeolocationControl extends Control<GeolocationControlProps> {
  public componentDidMount() {
    const { showAddressBar, enableAutoLocation } = this.props
    this.extendedEvents = CONTROL_EVENTS
    this.instance = new BMap.GeolocationControl({ showAddressBar, enableAutoLocation })
    this.initialProperties()
    this.context.nativeInstance!.addControl(this.instance)
  }
}

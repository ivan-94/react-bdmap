/**
 * 针对移动端开发，默认位于地图左下方
 */
import Control from './Control'

export interface GeolocationControlProps {
  // 是否显示定位信息面板。默认显示定位信息面板
  showAddressBar?: boolean
  // 添加控件时是否进行定位。默认添加控件时不进行定位
  enableAutoLocation?: boolean
  icon?: BMap.Icon
  onLocationSuccess?: (
    evt: { point: BMap.Point; type: 'locationSuccess'; addressComponent: BMap.AddressComponent },
  ) => void
  // TODO: 类型是什么
  onLocationError?: (error: { status: number }) => void
}

const CONTROL_EVENTS = ['locationSuccess', 'locationError']

export default class GeolocationControl extends Control<GeolocationControlProps> {
  public componentDidMount() {
    const { showAddressBar, enableAutoLocation, icon } = this.props
    this.extendedEvents = CONTROL_EVENTS
    this.instance = new BMap.GeolocationControl({ showAddressBar, enableAutoLocation, locationIcon: icon })
    this.initialProperties()
    this.context.nativeInstance!.addControl(this.instance)
  }
}

import Control, { ControlProps } from './Control'

export interface GeolocationControlProps extends ControlProps {
  /** 是否显示定位信息面板。默认显示定位信息面板 */
  showAddressBar?: boolean
  /** 添加控件时是否进行定位。默认添加控件时不进行定位 */
  enableAutoLocation?: boolean
  /** 可自定义定位中心点的Icon样式 */
  icon?: BMap.Icon
  /** 定位成功后触发此事件 */
  onLocationSuccess?: (
    evt: {
      point: BMap.Point
      type: 'locationSuccess'
      addressComponent: BMap.AddressComponent
    },
  ) => void
  /** 定位失败后触发此事件 */
  onLocationError?: (error: { statusCode: number }) => void
}

/**
 * 百度地图的事件命名不规范, 正常都是小写, 而这里是小写驼峰式
 */
const CONTROL_EVENTS = ['location_Success', 'location_Error']

/**
 * 针对移动端开发，默认位于地图左下方
 * @visibleName 定位控件 - GeolocationControl
 */
export default class GeolocationControl extends Control<GeolocationControlProps> {
  public constructor(props: any) {
    super(props)

    const { showAddressBar, enableAutoLocation, icon } = this.props
    this.extendedEvents = CONTROL_EVENTS
    this.instance = new BMap.GeolocationControl({
      showAddressBar,
      enableAutoLocation,
      locationIcon: icon,
    })
  }

  /**
   * 开始定位
   */
  public location(): void {
    ;(this.instance as any).location()
  }

  /**
   * 返回当前的定位信息。若当前还未定位，则返回null
   */
  public getAddressComponent(): BMap.AddressComponent {
    return (this.instance as any).getAddressComponent()
  }
}

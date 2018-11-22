/**
 * 表示缩略地图控件
 * TODO: 事件
 * TODO: 方法
 */
import Control from './Control'

export interface OverviewMapControlProps {
  size?: BMap.Size
  defaultOpen?: boolean
  onViewChanged?: (event: { type: string; target: any; isOpen: boolean }) => void
  onViewChanging?: (event: { type: string; target: any }) => void
}

const CONTROL_PROPERTIES = ['size']
const CONTROL_EVENTS = ['ViewChanged', 'ViewChanging']

export default class OverviewMapControl extends Control<OverviewMapControlProps> {
  public componentDidMount() {
    this.extendedProperties = CONTROL_PROPERTIES
    this.extendedEvents = CONTROL_EVENTS
    const { defaultOpen: isOpen } = this.props
    this.instance = new BMap.OverviewMapControl({ isOpen })
    this.initialProperties()
    this.context.nativeInstance!.addControl(this.instance)
  }
}

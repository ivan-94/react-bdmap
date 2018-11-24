/**
 * 表示缩略地图控件
 */
import Control from './Control'

export interface OverviewMapControlProps {
  size?: BMap.Size
  defaultOpen?: boolean
  onViewchanged?: (
    event: { type: string; target: any; isOpen: boolean },
  ) => void
  onViewchanging?: (event: { type: string; target: any }) => void
}

const CONTROL_PROPERTIES = ['size']
const CONTROL_EVENTS = ['viewchanged', 'viewchanging']

export default class OverviewMapControl extends Control<
  OverviewMapControlProps
> {
  public componentDidMount() {
    this.extendedProperties = CONTROL_PROPERTIES
    this.extendedEvents = CONTROL_EVENTS
    const { defaultOpen: isOpen } = this.props
    this.instance = new BMap.OverviewMapControl({ isOpen })
    this.context.nativeInstance!.addControl(this.instance)
    this.initialProperties()
  }
}

import Control, { ControlProps } from './Control'

export interface OverviewMapControlProps extends ControlProps {
  /** 设置缩略地图的大小 */
  size?: BMap.Size
  /** 缩略地图添加到地图后的开合状态，默认为关闭 */
  defaultOpen?: boolean
  /** 缩略地图开合状态发生变化后触发此事件 */
  onViewchanged?: (event: { type: string; target: any; isOpen: boolean }) => void
  /** 缩略地图开合状态发生变化过程中触发此事件 */
  onViewchanging?: (event: { type: string; target: any }) => void
}

const CONTROL_PROPERTIES = ['size']
const CONTROL_EVENTS = ['viewchanged', 'viewchanging']

/**
 * 表示缩略地图控件. 默认位于地图右下方，是一个可折叠的缩略地图
 * @visibleName 缩略图控件
 */
export default class OverviewMapControl extends Control<OverviewMapControlProps> {
  public constructor(props: any) {
    super(props)

    this.extendedProperties = CONTROL_PROPERTIES
    this.extendedEvents = CONTROL_EVENTS
    const { defaultOpen: isOpen } = this.props
    this.instance = new BMap.OverviewMapControl({ isOpen })
  }

  /**
   * 切换缩略地图控件的开合状态
   */
  public changeView() {
    ;(this.instance as BMap.OverviewMapControl).changeView()
  }
}

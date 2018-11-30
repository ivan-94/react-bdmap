import React from 'react'
import Overlay from './Overlay'

export interface LabelProps {
  /** 设置文本标注坐标 */
  position: BMap.Point
  /** 设置文本标注的内容。支持HTML */
  content: string
  /** 样式 */
  style?: React.CSSProperties
  /** 设置文本标注的偏移值 */
  offset?: BMap.Size
  /** 设置文本标注的标题，当鼠标移至标注上时显示此标题 */
  title?: string
  /** 设置覆盖物的zIndex */
  zIndex?: number

  /** 允许覆盖物在map.clearOverlays方法中被清除 */
  enableMassClear?: boolean

  onClick?: (event: { type: string; target: any }) => void
  onDoubleClick?: (event: { type: string; target: any }) => void
  onMouseDown?: (event: { type: string; target: any }) => void
  onMouseUp?: (event: { type: string; target: any }) => void
  onMouseOut?: (event: { type: string; target: any }) => void
  onMouseOver?: (event: { type: string; target: any }) => void
  onRemove?: (event: { type: string; target: any }) => void
  onRightClick?: (event: { type: string; target: any }) => void
}

const PROPERTIES = ['position', 'style', 'content', 'offset', 'title', 'zIndex']
const ENABLEABLE_PROPERTIES = ['massClear']
const EVENTS = ['click', 'dbl_click', 'mouse_down', 'mouse_up', 'mouse_out', 'mouse_over', 'remove', 'right_click']

/**
 * 表示地图上的文本标注
 * @visibleName 标签 - Label
 */
export default class Label extends Overlay<LabelProps> {
  public static defaultProps = {
    enableMassClear: true,
  }

  public constructor(props: LabelProps) {
    super(props)
    const { position, content } = this.props
    this.extendedProperties = PROPERTIES
    this.extendedEnableableProperties = ENABLEABLE_PROPERTIES
    this.extendedEvents = EVENTS

    this.instance = new BMap.Label(content, {
      position,
    })
  }

  protected getPosition = () => {
    return this.props.position
  }
}

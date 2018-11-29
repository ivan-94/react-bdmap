/**
 * 表示地图上的文本标注
 */
import React from 'react'
import Overlay from './Overlay'

export interface LabelProps {
  position: BMap.Point
  content: string
  style?: React.CSSProperties
  offset?: BMap.Size
  title?: string
  zIndex?: number

  enableMassClear?: boolean

  onClick: (event: { type: string; target: any }) => void
  onDoubleClick: (event: { type: string; target: any }) => void
  onMouseDown: (event: { type: string; target: any }) => void
  onMouseUp: (event: { type: string; target: any }) => void
  onMouseOut: (event: { type: string; target: any }) => void
  onMouseOver: (event: { type: string; target: any }) => void
  onRemove: (event: { type: string; target: any }) => void
  onRightClick: (event: { type: string; target: any }) => void
}

const PROPERTIES = ['position', 'style', 'content', 'offset', 'title', 'zIndex']
const ENABLEABLE_PROPERTIES = ['massClear']
const EVENTS = ['click', 'dbl_click', 'mouse_down', 'mouse_up', 'mouse_out', 'mouse_over', 'remove', 'right_click']

export default class Label extends Overlay<LabelProps> {
  public static defaultProps: Partial<LabelProps> = {
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

  protected getPosition() {
    return this.props.position
  }
}

import React from 'react'
import Control, { ControlProps } from './Control'
import ReactDOM from 'react-dom'

export interface CustomControlProps extends ControlProps {
  /** 自定义渲染的空间元素 */
  children: React.ReactNode
}

const PROPERTIES = ['anchor', 'offset']

export function getClass() {
  return class extends BMap.Control {
    public defaultAnchor = BMAP_ANCHOR_TOP_RIGHT
    public defaultOffset = new BMap.Size(10, 10)
    public elm: HTMLElement

    public constructor(elm: HTMLElement) {
      super()
      this.elm = elm
    }

    public initialize(map: BMap.Map) {
      map.getContainer().appendChild(this.elm)
      return this.elm
    }
  }
}

/**
 * 用于实现自定义控件. 默认位于地图的右上方
 * @visibleName 自定义控件 - CustomControl
 */
export default class CustomControl extends Control<CustomControlProps> {
  private elm = document.createElement('div')
  public static CustomControlInner: ReturnType<typeof getClass>

  protected initialize = () => {
    if (CustomControl.CustomControlInner == null) {
      CustomControl.CustomControlInner = getClass()
    }

    this.extendedProperties = PROPERTIES
    this.instance = new CustomControl.CustomControlInner(this.elm)
  }

  public render(): React.ReactElement {
    return ReactDOM.createPortal(this.props.children, this.elm)
  }
}

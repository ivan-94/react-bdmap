import React from 'react'
import ReactDOM from 'react-dom'
import Overlay, { PaneType } from './Overlay'

export interface CustomOverlayProps {
  /**
   * 设置标注的地理坐标. 这个坐标将作为自定义DOM元素的左上角, 可以通过offset或CSS translate设置偏移值
   */
  position: BMap.Point
  /**
   * 设置标注的偏移值
   */
  offset?: BMap.Size
  /**
   * 设置覆盖物的zIndex
   */
  zIndex?: number
  /**
   * 自定义DOM元素
   */
  children: React.ReactNode
  /**
   * 自定义覆盖物插入的容器
   */
  pane?: PaneType
}

// 惰性生成
export function getClass() {
  // @ts-ignore BMap.Overlay 其实是类
  return class extends BMap.Overlay {
    public position: BMap.Point
    public owner: CustomOverlay
    public offset?: BMap.Size
    public elm: HTMLDivElement
    public pane: PaneType
    public map: BMap.Map

    public constructor(owner: CustomOverlay, position: BMap.Point, elm: HTMLDivElement, pane: PaneType = 'markerPane') {
      super()
      this.owner = owner
      this.position = position
      this.elm = elm
      this.pane = pane
    }

    public initialize = (map: BMap.Map) => {
      this.elm.style.position = 'absolute'
      this.map = map
      ;(map.getPanes()[this.pane] as HTMLElement).appendChild(this.elm)
      return this.elm
    }

    public draw = () => {
      if (this.position == null || this.map == null) {
        return
      }

      const position = this.map.pointToOverlayPixel(this.position)
      const { width = 0, height = 0 } = this.offset || {}

      this.elm.style.left = `${position.x + width}px`
      this.elm.style.top = `${position.y + height}px`
    }

    public setPosition = (position: BMap.Point) => {
      this.position = position
      this.draw()
    }

    public getPosition = () => {
      this.position
    }

    public setOffset = (offset: BMap.Size) => {
      this.offset = offset
      this.draw()
    }

    public setZIndex = (index: number) => {
      this.elm.style.zIndex = index.toString()
    }
  }
}

const PROPERTIES = ['position', 'offset', 'zIndex']

/**
 * 自定义覆盖物. 用于渲染自定义的DOM对象
 * @visibleName 自定义覆盖物 - CustomOverlay
 */
export default class CustomOverlay extends Overlay<CustomOverlayProps> {
  private elm = document.createElement('div')
  public static CustomOverlayInner: ReturnType<typeof getClass>

  protected initialize = () => {
    if (CustomOverlay.CustomOverlayInner == null) {
      CustomOverlay.CustomOverlayInner = getClass()
    }
    const { pane, position } = this.props
    this.extendedProperties = PROPERTIES
    this.instance = new CustomOverlay.CustomOverlayInner(this, position, this.elm, pane)
  }

  protected customRender = () => {
    return ReactDOM.createPortal(this.props.children, this.elm)
  }

  protected getPosition = () => {
    return this.props.position
  }
}

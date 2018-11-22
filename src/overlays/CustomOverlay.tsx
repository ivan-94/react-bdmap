/**
 * 自定义覆盖物
 */
import React from 'react'
import ReactDOM from 'react-dom'
import Overlay from './Overlay'

export interface CustomOverlayProps {
  position: BMap.Point
  offset?: BMap.Size
  zIndex?: number
  children: React.ReactNode
  pane?: PaneType
}

export type PaneType =
  | 'markerPane'
  | 'floatPane'
  | 'markerMouseTarget'
  | 'floatShadow'
  | 'labelPane'
  | 'markerShadow'
  | 'mapPane'

// 惰性生成
export function getClass() {
  // @ts-ignore BMap.Overlay 其实是类
  return class extends BMap.Overlay {
    private position: BMap.Point
    private offset?: BMap.Size
    private elm: HTMLDivElement
    private pane: PaneType
    private map: BMap.Map

    public constructor(position: BMap.Point, elm: HTMLDivElement, pane: PaneType = 'markerPane') {
      super()
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

export default class CustomOverlay extends Overlay<CustomOverlayProps> {
  private elm = document.createElement('div')
  public static CustomOverlayInner: ReturnType<typeof getClass>

  protected initialize = () => {
    if (CustomOverlay.CustomOverlayInner == null) {
      CustomOverlay.CustomOverlayInner = getClass()
    }
    const { pane, position } = this.props
    this.extendedProperties = PROPERTIES
    this.instance = new CustomOverlay.CustomOverlayInner(position, this.elm, pane)
  }

  public render() {
    return ReactDOM.createPortal(this.props.children, this.elm)
  }
}
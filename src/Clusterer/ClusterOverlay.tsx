import ReactDOM from 'react-dom'

import { PaneType } from '../overlays/Overlay'
import { getExtendedBounds } from './utils'
import { ClustererProps, MarkerOverlay } from './type'

interface IOverlay extends BMap.Overlay {
  setPosition(pos: BMap.Point): void
  show(): void
  hide(): void
  setSize(size: number): void
}

/**
 * clusterer 自身的百度地图覆盖物
 * 因为只有在BMap加载完才能使用，所以包裹在getClass惰性渲染
 */
function getClass() {
  // @ts-ignore BMap.Overlay 是类
  return class ClustererMarker extends BMap.Overlay implements IOverlay {
    public owner: ClusterOverlay
    public position?: BMap.Point
    public pane: PaneType
    public map: BMap.Map
    public elm: HTMLDivElement

    public constructor(
      owner: ClusterOverlay,
      position: BMap.Point | undefined,
      elm: HTMLDivElement,
      pane: PaneType = 'markerPane',
    ) {
      super()
      this.owner = owner
      this.position = position
      this.elm = elm
      this.pane = pane
    }

    public initialize = (map: BMap.Map) => {
      this.elm.style.position = 'absolute'
      this.elm.style.transform = 'translate(-50%, -50%)'
      this.map = map
      ;(map.getPanes()[this.pane] as HTMLElement).appendChild(this.elm)
      return this.elm
    }

    // 绘制并定位
    public draw = () => {
      if (this.position == null || this.map == null) {
        return
      }

      const position = this.map.pointToOverlayPixel(this.position)
      this.elm.style.left = `${position.x}px`
      this.elm.style.top = `${position.y}px`
      // 渲染
      if (this.owner.options.render) {
        const nodes = Array.from(this.owner.markers).map(i => i.owner)
        const node = this.owner.options.render(nodes)
        ReactDOM.render(node, this.elm)
      }
    }

    public setPosition = (position: BMap.Point) => {
      this.position = position
      this.draw()
    }

    public getPosition = () => {
      return this.position
    }

    public setSize(size: number) {
      this.elm.innerHTML = `${size}`
    }

    public show() {}
    public hide() {}
  }
}

let OverlayInner: ReturnType<typeof getClass>

/**
 * 一个聚合点
 */
export class ClusterOverlay {
  public center?: BMap.Point
  public options: ClustererProps
  public markers: Set<MarkerOverlay> = new Set()
  // 当前聚合点网格范围
  private gridBounds?: BMap.Bounds
  private map: BMap.Map
  private overlay?: IOverlay
  private elm = document.createElement('div')

  public constructor(map: BMap.Map, props: ClustererProps) {
    this.map = map
    this.options = props
  }

  /**
   * 减产是否在cluster的范围内
   */
  public isMarkerInClusterBounds(marker: MarkerOverlay) {
    return this.gridBounds && this.gridBounds.containsPoint(marker.getPosition())
  }

  /**
   * 添加标记
   */
  public addMarker(marker: MarkerOverlay) {
    if (this.hasMarker(marker)) {
      return
    }

    // 计算中心点
    if (!this.center) {
      this.center = marker.getPosition()
      this.updateGridBounds()
    } else if (this.options.AverageCenter) {
      // 计算平均中心点
      // TODO:
    }

    marker.isInCluster = true
    this.markers.add(marker)
    const len = this.markers.size

    // 小于聚合数，直接添加到地图
    if (len < this.options.minSize) {
      this.map.addOverlay(marker)
      return
    } else if (len === this.options.minSize) {
      // 达到聚合条件
      this.markers.forEach(o => this.map.removeOverlay(o))
    }

    // 渲染聚合本身
    this.map.addOverlay(this.getOrCreateClusterMarker())
    this.updateClusterMarker()
  }

  public hasMarker(overlay?: any) {
    if (overlay != null && this.markers.has(overlay)) {
      return true
    }
    return false
  }

  /**
   * 销毁
   */
  public remove() {
    this.markers.forEach(o => this.map.removeOverlay(o))
    if (this.overlay) {
      this.map.removeOverlay(this.overlay)
    }
    this.markers.clear()
  }

  /**
   * 更新该聚合的网格范围
   */
  private updateGridBounds() {
    const bounds = new BMap.Bounds(this.center!, this.center!)
    this.gridBounds = getExtendedBounds(this.map, bounds, this.options.gridSize)
  }

  private getOrCreateClusterMarker() {
    if (OverlayInner == null) {
      OverlayInner = getClass()
    }

    if (this.overlay == null) {
      this.overlay = new OverlayInner(this, this.center, this.elm)
    }

    return this.overlay
  }

  /**
   * 更新该聚合的显示样式，也即TextIconOverlay。
   */
  private updateClusterMarker() {
    if (this.map.getZoom() > this.options.maxZoom) {
      this.overlay && this.map.removeOverlay(this.overlay)
      this.markers.forEach(o => this.map.addOverlay(o))
      return
    }

    if (this.overlay == null) {
      return
    }

    if (this.markers.size < this.options.minSize) {
      this.overlay.hide()
      return
    }

    this.overlay.setPosition(this.center!)

    // var thatMap = this._map
    // var thatBounds = this.getBounds()
    // this._clusterMarker.addEventListener('click', function(event) {
    //   thatMap.setViewport(thatBounds)
    // })
  }
}

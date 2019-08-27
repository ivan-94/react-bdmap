import React from 'react'
import debounce from 'lodash/debounce'
import { BDMapContext, BDMapContextValue } from '../BDMap'

import Overlay from '../overlays/Overlay'
import { ClusterOverlay } from './ClusterOverlay'
import { getExtendedBounds } from './utils'
import { MarkerOverlay, ClustererProps } from './type'

function isNativeOverlay(overlay: any): overlay is BMap.Overlay {
  // @ts-ignore
  return overlay != null && overlay instanceof BMap.Overlay
}

/**
 * 点聚合
 * TODO: 处理marker 更新
 */
export class Clusterer extends Overlay<ClustererProps> {
  public static defaultProps = {
    minSize: 2,
    maxZoom: 18,
    gridSize: 60,
  }

  private get map() {
    return this.context.nativeInstance!
  }

  // 下级注册的标注
  private markers: Set<MarkerOverlay> = new Set()
  // 聚合点
  private clusters: ClusterOverlay[] = []

  // TODO: 缓存
  private get overideContext(): BDMapContextValue {
    return {
      nativeInstance: (this as any) as BMap.Map,
      container: this.context.container!,
    }
  }

  public render() {
    return <BDMapContext.Provider value={this.overideContext}>{this.props.children}</BDMapContext.Provider>
  }

  protected initialize = () => {
    // 初始化
    // TODO: 初始化zoom事件
    this.map.addEventListener('zoomend', this.redraw)
    this.map.addEventListener('moveend', this.redraw)
  }

  protected destroy = () => {
    this.map.removeEventListener('zoomend', this.redraw)
    this.map.removeEventListener('moveend', this.redraw)
  }

  protected addOverlay = (overlay: BMap.Overlay) => {
    if (isNativeOverlay(overlay) && 'getPosition' in overlay) {
      // 添加marker
      this.addMarker(overlay)
      // update
      return
    }
    // 不作处理
    this.map.addOverlay(overlay)
  }

  protected removeOverlay = (overlay: BMap.Overlay) => {
    if (this.hasMarker(overlay)) {
      this.removeMarker(overlay as MarkerOverlay)
      return
    }

    this.map.removeOverlay(overlay)
  }

  private hasMarker(overlay?: any) {
    if (overlay != null && this.markers.has(overlay)) {
      return true
    }
    return false
  }

  private addMarker(marker: MarkerOverlay) {
    if (this.hasMarker(marker)) {
      return
    }

    marker.isInCluster = false
    // 拦截setPosition
    if (marker.setPosition && marker._setPostion == null) {
      marker._setPostion = marker.setPosition
      marker._lastPositon = marker.getPosition()
      marker.setPosition = v => {
        marker._setPostion(v)
        // 一百米移动
        if (marker._lastPositon && this.map.getDistance(marker._lastPositon, v) > 100) {
          this.redraw()
          marker._lastPositon = v
        }
      }
    }

    this.markers.add(marker)
    this.createClusters()
  }

  private removeMarker(marker: MarkerOverlay) {
    const suc = this.markers.delete(marker)

    if (suc) {
      marker.setPosition = marker._setPostion
      this.map.removeOverlay(marker)
      this.clearLastClusters()
      this.createClusters()
    }
  }

  private createClusters() {
    const mapBounds = this.map.getBounds()
    var extendedBounds = getExtendedBounds(this.map, mapBounds, this.props.gridSize)

    this.markers.forEach(m => {
      if (!m.isInCluster && extendedBounds.containsPoint(m.getPosition())) {
        // 添加到最近的聚合点
        this.addToClosestCluster(m)
      }
    })
  }

  private addToClosestCluster(marker: MarkerOverlay) {
    let distance = 4000000
    let clusterToAddTo: ClusterOverlay | undefined
    const pos = marker.getPosition()
    // 获取最近的聚合点
    for (const cluster of this.clusters) {
      var center = cluster.center
      if (center) {
        var d = this.map.getDistance(center, pos)
        if (d < distance) {
          distance = d
          clusterToAddTo = cluster
        }
      }
    }

    if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
      clusterToAddTo.addMarker(marker)
    } else {
      // 创建新的聚合点
      var cluster = new ClusterOverlay(this.map, this.props)
      cluster.addMarker(marker)
      this.clusters.push(cluster)
    }
  }

  /**
   * 清除上一次的聚合的结果
   */
  private clearLastClusters() {
    this.clusters.forEach(c => c.remove())
    this.clusters = []
    this.removeMarkersFromCluster() //把Marker的cluster标记设为false
  }

  private removeMarkersFromCluster() {
    this.markers.forEach(i => (i.isInCluster = false))
  }

  public redraw = debounce(() => {
    this.clearLastClusters()
    this.createClusters()
  }, 300)
}

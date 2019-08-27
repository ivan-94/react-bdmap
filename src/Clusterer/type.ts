export interface ClustererProps {
  /**
   * 是否计算中心点进行聚合
   */
  AverageCenter?: boolean
  /**
   * 最少聚合数, 默认是2
   */
  minSize: number
  /**
   * 最大的聚合级别，大于该级别就不进行相应的聚合 默认18
   */
  maxZoom: number
  gridSize: number
  /**
   * 自定义渲染, 接受一组覆盖物节点数据
   */
  render?: (markers: any[]) => React.ReactElement
}

export interface MarkerOverlay extends BMap.Overlay {
  getPosition(): BMap.Point
  setPosition(pt: BMap.Point): void
  // 是否在局甜点中
  isInCluster?: boolean
  getMap(): BMap.Map | undefined
  _lastPositon?: BMap.Point
  _setPostion(pt: BMap.Point): void
}

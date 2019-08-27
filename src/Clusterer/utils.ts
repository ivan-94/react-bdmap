/**
 * 获取一个扩展的视图范围，把上下左右都扩大一样的像素值。
 * @param {Map} map BMap.Map的实例化对象
 * @param {BMap.Bounds} bounds BMap.Bounds的实例化对象
 * @param {Number} gridSize 要扩大的像素值
 *
 * @return {BMap.Bounds} 返回扩大后的视图范围。
 */
export const getExtendedBounds = (map: BMap.Map, bounds: BMap.Bounds, gridSize: number) => {
  bounds = cutBoundsInRange(bounds)
  var pixelNE = map.pointToPixel(bounds.getNorthEast())
  var pixelSW = map.pointToPixel(bounds.getSouthWest())
  pixelNE.x += gridSize
  pixelNE.y -= gridSize
  pixelSW.x -= gridSize
  pixelSW.y += gridSize
  var newNE = map.pixelToPoint(pixelNE)
  var newSW = map.pixelToPoint(pixelSW)
  return new BMap.Bounds(newSW, newNE)
}

/**
 * 按照百度地图支持的世界范围对bounds进行边界处理
 * @param {BMap.Bounds} bounds BMap.Bounds的实例化对象
 *
 * @return {BMap.Bounds} 返回不越界的视图范围
 */
export const cutBoundsInRange = function(bounds: BMap.Bounds) {
  var maxX = getRange(bounds.getNorthEast().lng, -180, 180)
  var minX = getRange(bounds.getSouthWest().lng, -180, 180)
  var maxY = getRange(bounds.getNorthEast().lat, -74, 74)
  var minY = getRange(bounds.getSouthWest().lat, -74, 74)
  return new BMap.Bounds(new BMap.Point(minX, minY), new BMap.Point(maxX, maxY))
}

/**
 * 对单个值进行边界处理。
 * @param {Number} i 要处理的数值
 * @param {Number} min 下边界值
 * @param {Number} max 上边界值
 *
 * @return {Number} 返回不越界的数值
 */
const getRange = (i: number, min: number, max: number) => {
  min && (i = Math.max(i, min))
  max && (i = Math.min(i, max))
  return i
}

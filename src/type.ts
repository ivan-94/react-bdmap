/**
 * coordinate
 */
export interface Coord {
  lat: number
  lng: number
  coordType?: CoordType
}

/**
 * 地图坐标类型，在中国地区，所有地图的坐标都是经过加密的, 中国地区以外都是GPS坐标
 * + WGS84 是GPS坐标, HTML5位置接口返回的格式
 * + GCJ02 是火星坐标，在中国地区，高德、GoogleMap都是使用这个格式的坐标
 * + BD08 百度坐标
 */
export type CoordType = 'WGS84' | 'GCJ02' | 'BD09'

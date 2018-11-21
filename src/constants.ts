/**
 * 百度地图支持的属性
 */
export const BDMAP_PROPERTIES = [
  { name: 'dragging', type: 'enableable', defaultValue: true },
  { name: 'scrollWheelZoom', type: 'enableable', defaultValue: false },
  { name: 'doubleClickZoom', type: 'enableable', defaultValue: true },
  { name: 'keyboard', type: 'enableable', defaultValue: false },
  { name: 'inertialDragging', type: 'enableable', defaultValue: false },
  { name: 'continuousZoom', type: 'enableable', defaultValue: false },
  { name: 'pinchToZoom', type: 'enableable', defaultValue: true },
  { name: 'autoResize', type: 'enableable', defaultValue: true },
  // settable
  {
    name: 'center',
    type: 'settable',
    methodName: 'centerAndZoom',
    method: (map: BMap.Map, props: object, value: any) => {
      if (value == null) {
        return
      }
      map.centerAndZoom(value, map.getZoom())
    },
  },
  { name: 'minZoom', type: 'settable', defaultValue: 3 },
  { name: 'maxZoom', type: 'settable', defaultValue: 18 },
  { name: 'mapStyle', type: 'settable', defaultValue: () => BMap && BMAP_NORMAL_MAP },
  { name: 'zoom', type: 'settable', defaultValue: 15 },
]

import Overlay, { PaneType } from './Overlay'

export interface CanvasLayerProps {
  /**
   * 对应canvas的css z-index属性，当添加了多个CanvasLayer时，可以用于设置层叠顺序
   */
  zIndex?: number
  /**
   * CanvasLayer位于的覆盖物层级，例：paneName: floatPane。JSAPI把地图覆盖物分为了8个层级，
   * 顶层为'floatPane'， 低层为'vertexPane'。可以通过Map实例的getPanes()方法，获取到8个层级的名称
   */
  paneName?: PaneType
  /**
   * 具体的绘制逻辑
   */
  update: (canvas: HTMLCanvasElement, map: BMap.Map) => void
}

/**
 * 用于在地图上绘制自定义的canvas2D或WebGL图形
 */
export default class CanvasLayer extends Overlay<CanvasLayerProps> {
  protected initialize = () => {
    const { zIndex, paneName, update } = this.props

    const context = this.context
    // @ts-ignore 3.0 中提供
    this.instance = new BMap.CanvasLayer({
      zIndex,
      paneName,
      update: function() {
        update(this.canvas, context.nativeInstance!)
      },
    })
  }

  protected getPosition() {
    return undefined
  }
}

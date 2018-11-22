/**
 * 表示比例尺控件
 */
import Control from './Control'

export interface ScaleControlProps {
  unit?: BMap.LengthUnit
}

const CONTROL_PROPERTIES = ['unit']

export default class ScaleControl extends Control<ScaleControlProps> {
  public componentDidMount() {
    this.extendedProperties = CONTROL_PROPERTIES
    this.instance = new BMap.ScaleControl()
    this.initialProperties()
    this.context.nativeInstance!.addControl(this.instance)
  }
}

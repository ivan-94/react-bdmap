import Control, { ControlProps } from './Control'

export interface ScaleControlProps extends ControlProps {
  /** 设置比例尺单位制, 可选值有BMAP\_UNIT\_METRIC(公制), BMAP\_UNIT\_IMPERIAL(英制). 默认值是BMAP\_UNIT\_METRIC */
  unit?: BMap.LengthUnit
}

const CONTROL_PROPERTIES = ['unit']

/**
 * 表示比例尺控件, 默认位于地图左下方，显示地图的比例关系
 */
export default class ScaleControl extends Control<ScaleControlProps> {
  public constructor(props: any) {
    super(props)

    this.extendedProperties = CONTROL_PROPERTIES
    this.instance = new BMap.ScaleControl()
  }
}

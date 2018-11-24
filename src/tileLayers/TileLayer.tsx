import React from 'react'
import { BDMapContext } from '../BDMap'
import { MESSAGE_CONTEXT_MISSING } from '../constants'

export interface TileLayerProps {}

/**
 * 所有地图图层的抽象类. 负责管理图层的生命周期.
 */
export default abstract class TileLayer<P> extends React.Component<
  P & TileLayerProps
> {
  public static contextType = BDMapContext
  public context!: React.ContextType<typeof BDMapContext>
  protected instance: BMap.TileLayer

  public componentDidMount() {
    if (this.context == null) {
      throw new Error('TileLayer: ' + MESSAGE_CONTEXT_MISSING)
    }

    this.context.nativeInstance!.addTileLayer(this.instance)
  }

  public componentWillUnmount() {
    this.context.nativeInstance!.removeTileLayer(this.instance)
  }

  public render() {
    return null
  }
}

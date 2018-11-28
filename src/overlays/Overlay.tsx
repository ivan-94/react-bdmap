/**
 * 所有内置Overlay的父类
 */
import React from 'react'
import { BDMapContext } from '../BDMap'
import {
  initializeSettableProperties,
  updateSettableProperties,
  initializeEnableableProperties,
  updateEnableableProperties,
  initializeEvents,
  updateEvents,
} from '../utils'

export type PaneType =
  | 'markerPane'
  | 'floatPane'
  | 'markerMouseTarget'
  | 'floatShadow'
  | 'labelPane'
  | 'markerShadow'
  | 'mapPane'

export interface OverlayProps {}

export interface ChildrenInjectedProps {
  position?: BMap.Point
  overlay?: BMap.Overlay
}

export default abstract class Overlay<P> extends React.PureComponent<
  OverlayProps & P
> {
  public static contextType = BDMapContext
  public context!: React.ContextType<typeof BDMapContext>
  protected instance: BMap.Overlay
  protected extendedProperties: string[] = []
  /**
   * 对于enable 类型的属性应该通过defaultProps提供默认值
   */
  protected extendedEnableableProperties: string[] = []
  protected extendedEvents: string[] = []
  protected initialize?: () => void
  protected customRender?: () => React.ReactNode

  public componentDidMount() {
    if (this.initialize) {
      this.initialize()
    }

    if (this.instance && this.context) {
      this.context.nativeInstance!.addOverlay(this.instance)
      // 添加到地图后才能正式进行DOM操作
      this.initialProperties()
    }
  }

  public componentDidUpdate(prevProps: P & OverlayProps) {
    this.updateProperties(prevProps)
  }

  public componentWillUnmount() {
    if (this.instance && this.context) {
      this.context.nativeInstance!.removeOverlay(this.instance)
    }
  }

  public render(): React.ReactNode {
    return (
      <>
        {!!this.customRender && this.customRender()}
        {!!this.instance &&
          React.Children.map(this.props.children, child =>
            React.isValidElement(child)
              ? React.cloneElement(
                  child as React.ReactElement<ChildrenInjectedProps>,
                  {
                    position: this.getPosition(),
                    overlay: this.instance,
                  },
                )
              : child,
          )}
      </>
    )
  }

  // 获取当前位置
  protected abstract getPosition(): BMap.Point | undefined

  protected initialProperties() {
    // initial property
    initializeSettableProperties(
      this.extendedProperties,
      this.instance,
      this.props,
    )
    initializeEnableableProperties(
      this.extendedEnableableProperties,
      this.instance,
      this.props,
    )

    // initial events
    initializeEvents(this.extendedEvents, this.instance, this.props, this)
  }

  protected updateProperties(prevProps: P & OverlayProps) {
    // update properties
    updateSettableProperties(
      this.extendedProperties,
      this.instance,
      this.props,
      prevProps,
    )
    updateEnableableProperties(
      this.extendedEnableableProperties,
      this.instance,
      this.props,
      prevProps,
    )

    // update Events
    updateEvents(
      this.extendedEvents,
      this.instance,
      this.props,
      prevProps,
      this,
    )
  }
}
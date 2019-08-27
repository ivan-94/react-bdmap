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
  isDesktop,
  settableEquals,
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

export function isOverlay(el: React.ElementType | null) {
  if (React.isValidElement(el)) {
    return el.type instanceof Overlay
  }
  return false
}

/**
 * Overlay 是一个抽象类, 是所有覆盖物的父类. 负责管理覆盖物的生命周期, 初始化和更新属性/事件. 如果要实现更高级的自定义覆盖物
 * 可以继承该类.
 * @visibleName Overlay
 */
export default abstract class Overlay<P> extends React.PureComponent<OverlayProps & P> {
  public static contextType = BDMapContext
  public context!: React.ContextType<typeof BDMapContext>
  public isOverlay = true
  protected instance: BMap.Overlay
  protected extendedProperties: string[] = []
  /**
   * 对于enable 类型的属性应该通过defaultProps提供默认值
   */
  protected extendedEnableableProperties: string[] = []
  protected extendedEvents: string[] = []
  /**
   * 这些属性变动将强制重新绘制
   */
  protected extendedForceReloadProperties: string[] = []
  protected initialize?: () => void
  protected destroy?: () => void
  protected customRender?: () => React.ReactNode
  protected getPosition?: () => BMap.Point | undefined

  public componentDidMount() {
    if (this.initialize) {
      this.initialize()
    }

    if (this.instance && this.context) {
      this.instance.owner = this
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

    if (this.destroy) {
      this.destroy()
    }
  }

  public render(): React.ReactNode {
    return (
      <>
        {this.customRender
          ? this.customRender()
          : !!this.instance &&
            React.Children.map(this.props.children, child =>
              React.isValidElement(child)
                ? React.cloneElement(child as React.ReactElement<ChildrenInjectedProps>, {
                    position: this.getPosition && this.getPosition(),
                    overlay: this.instance,
                  })
                : child,
            )}
      </>
    )
  }

  public getInstance() {
    return this.instance
  }

  protected initialProperties() {
    // initial property
    initializeSettableProperties(this.extendedProperties, this.instance, this.props)
    initializeEnableableProperties(this.extendedEnableableProperties, this.instance, this.props)

    // initial events
    initializeEvents(this.extendedEvents, this.instance, this.props, this)
  }

  protected updateProperties(prevProps: P & OverlayProps) {
    // update properties
    updateSettableProperties(this.extendedProperties, this.instance, this.props, prevProps)
    updateEnableableProperties(this.extendedEnableableProperties, this.instance, this.props, prevProps)

    // update Events
    updateEvents(this.extendedEvents, this.instance, this.props, prevProps, this)
    this.forceReloadIfNeed(this.props, prevProps)
  }

  /**
   * 判断是否需要重新渲染
   */
  private forceReloadIfNeed(props: P, prevProps: P) {
    if (!isDesktop && this.extendedForceReloadProperties.length) {
      let shouldReload = false
      for (let property of this.extendedForceReloadProperties) {
        const currentValue = props[property]
        const prevValue = prevProps[property]
        if (!settableEquals(currentValue, prevValue)) {
          shouldReload = true
          break
        }
      }

      if (shouldReload) {
        const map = this.context.container!
        map.reloadOverlays()
      }
    }
  }
}

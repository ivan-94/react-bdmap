import React from 'react'
import { BDMapContext } from '../BDMap'
import { MESSAGE_CONTEXT_MISSING } from '../constants'
import {
  updateSettableProperties,
  initializeSettableProperties,
  initializeEvents,
  updateEvents,
} from '../utils'

export interface ControlProps {
  /** 设置控件停靠的位置 */
  anchor?: BMap.ControlAnchor
  /** 设置控件停靠的偏移量 */
  offset?: BMap.Size
}

const COMMON_PROPERTIES = ['anchor', 'offset']

/**
 * 所有控件的抽象类. 负责管理控件的生命周期. 以及控制控件通用的props(anchor, offset)
 */
export default abstract class Control<P> extends React.PureComponent<P> {
  public static contextType = BDMapContext
  public context!: React.ContextType<typeof BDMapContext>
  protected instance: BMap.Control
  protected extendedProperties: string[] = []
  protected extendedEvents: string[] = []
  protected initialize?: () => void

  public componentDidMount() {
    if (this.context == null) {
      throw new Error(`Control: ` + MESSAGE_CONTEXT_MISSING)
    }

    if (this.initialize) {
      this.initialize()
    }

    this.context.nativeInstance!.addControl(this.instance)
    this.initialProperties()
  }

  public componentWillUnmount() {
    if (this.instance && this.context) {
      this.context.nativeInstance!.removeControl(this.instance)
    }
  }

  public componentDidUpdate(prevProps: P & ControlProps) {
    this.updateProperties(prevProps)
  }

  public render(): React.ReactNode {
    return null
  }

  protected initialProperties() {
    // initial property
    initializeSettableProperties(
      [...COMMON_PROPERTIES, ...this.extendedProperties],
      this.instance,
      this.props,
    )

    // initial events
    initializeEvents(this.extendedEvents, this.instance, this.props, this)
  }

  protected updateProperties(prevProps: P & ControlProps) {
    // update properties
    updateSettableProperties(
      [...COMMON_PROPERTIES, ...this.extendedProperties],
      this.instance,
      this.props,
      prevProps,
    )

    // update event bindings
    updateEvents(
      this.extendedEvents,
      this.instance,
      this.props,
      prevProps,
      this,
    )
  }
}

/**
 * 所有空间的父类
 */
import React from 'react'
import { BDMapContext } from '../BDMap'
import { updateSettableProperties, initializeSettableProperties, initializeEvents, updateEvents } from '../utils'

export interface ControlProps {
  anchor?: BMap.ControlAnchor
  offset?: BMap.Size
}

const COMMON_PROPERTIES = ['anchor', 'offset']

export default abstract class Control<P> extends React.PureComponent<P & ControlProps> {
  public static contextType = BDMapContext
  public context!: React.ContextType<typeof BDMapContext>
  protected instance: BMap.Control
  protected extendedProperties: string[] = []
  protected extendedEvents: string[] = []

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
    initializeSettableProperties([...COMMON_PROPERTIES, ...this.extendedProperties], this.instance, this.props)

    // initial events
    initializeEvents(this.extendedEvents, this.instance, this.props, this)
  }

  protected updateProperties(prevProps: P & ControlProps) {
    // update properties
    updateSettableProperties([...COMMON_PROPERTIES, ...this.extendedProperties], this.instance, this.props, prevProps)

    // update event bindings
    updateEvents(this.extendedEvents, this.instance, this.props, prevProps, this)
  }
}

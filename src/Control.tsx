/**
 * 所有空间的父类
 */
import React from 'react'
import { BDMapContext } from './BDMap'
import upperFirst from 'lodash/upperFirst'

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

  public render() {
    return null
  }

  protected initialProperties() {
    // initial property
    ;[...COMMON_PROPERTIES, ...this.extendedProperties].forEach(property => {
      const value = this.props[property]
      if (value != null) {
        const methodName = `set${upperFirst(property)}`
        if (typeof this.instance[methodName] === 'function') {
          this.instance[methodName](value)
        }
      }
    })

    // initial events
    this.extendedEvents.forEach(name => {
      const propsName = `on${name}`
      const methodName = propsName.toLowerCase()
      if (typeof this.props[propsName] === 'function') {
        this.instance[methodName] = this.props[propsName]
      }
    })
  }

  protected updateProperties(prevProps: P & ControlProps) {
    // update properties
    ;[...COMMON_PROPERTIES, ...this.extendedProperties].forEach(property => {
      if (this.props[property] !== prevProps[property]) {
        const value = this.props[property]
        const methodName = `set${upperFirst(property)}`
        if (typeof this.instance[methodName] === 'function') {
          this.instance[methodName](value)
        }
      }
    })

    // update event bindings
    this.extendedEvents.forEach(name => {
      const propsName = `on${name}`
      if (this.props[propsName] !== prevProps[propsName]) {
        const methodName = propsName.toLowerCase()
        this.instance[methodName] = this.props[propsName]
      }
    })
  }
}

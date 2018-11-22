import React from 'react'
import ReactDOM from 'react-dom'
import { BDMapContext } from '../BDMap'
import { initializeSettableProperties, updateSettableProperties } from '../utils'

export interface CustomControlProps {
  children: React.ReactNode
  anchor?: BMap.ControlAnchor
  offset?: BMap.Size
}

const PROPERTIES = ['anchor', 'offset']

export default class CustomControl extends React.Component<CustomControlProps> {
  private elm = document.createElement('div')
  public static contextType = BDMapContext
  public context!: React.ContextType<typeof BDMapContext>
  private instance: BMap.Control

  public componentDidMount() {
    if (this.context == null) {
      throw new TypeError(`CustomControl can only be used under BDMap`)
    }

    const elm = this.elm
    this.instance = new class extends BMap.Control {
      public defaultAnchor = BMAP_ANCHOR_TOP_RIGHT
      public defaultOffset = new BMap.Size(10, 10)
      public initialize(map: BMap.Map) {
        map.getContainer().appendChild(elm)
        return elm
      }
    }()

    initializeSettableProperties(PROPERTIES, this.instance, this.props)

    // 添加到map
    this.context.nativeInstance!.addControl(this.instance)
  }

  public componentDidUpdate(prevProps: CustomControlProps) {
    updateSettableProperties(PROPERTIES, this.instance, this.props, prevProps)
  }

  public componentWillUnmount() {
    if (this.context && this.instance) {
      this.context.nativeInstance!.removeControl(this.instance)
    }
  }

  public render() {
    return ReactDOM.createPortal(this.props.children, this.elm)
  }
}

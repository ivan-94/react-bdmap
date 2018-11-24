/**
 * 表示版权控件，您可以在地图上添加自己的版权信息。每一个版权信息需要包含如下内容：版权的唯一标识、版权内容和其适用的区域范围。
 */
import React from 'react'
import ReactDOM from 'react-dom'
import Control from './Control'

export interface CopyrightControlProps {
  children: React.ReactNode
}

export interface CopyrightProps {
  // 会渲染成字符串，所以事件在这里无效
  children: React.ReactNode
  bounds?: BMap.Bounds
  /**
   * @ignore 由CopyrightControl注入
   */
  control?: BMap.CopyrightControl
}

let uid: number = 0
export default class CopyrightControl extends Control<CopyrightControlProps> {
  /**
   * 渲染Copyright内容
   */
  public static Item = class Copyright extends React.PureComponent<
    CopyrightProps
  > {
    private innerEl: HTMLDivElement = document.createElement('div')
    private id: number = uid++

    public componentDidMount() {
      if (this.props.control) {
        this.addCopyright()
      }
    }

    public componentDidUpdate() {
      if (this.props.control) {
        this.props.control.removeCopyright(this.id)
        this.addCopyright()
      }
    }

    public componentWillUnmount() {
      if (this.props.control) {
        this.props.control.removeCopyright(this.id)
      }
    }

    public render() {
      return ReactDOM.createPortal(this.props.children, this.innerEl)
    }

    private addCopyright() {
      this.props.control!.addCopyright({
        id: this.id,
        bounds: this.props.bounds,
        content: this.innerEl.innerHTML,
      })
    }
  }

  public constructor(props: CopyrightControlProps) {
    super(props)
    this.instance = new BMap.CopyrightControl()
  }

  public componentDidMount() {
    if (this.context) {
      this.context.nativeInstance!.addControl(this.instance)
      this.initialProperties()
    }
  }

  public render() {
    return React.Children.map(this.props.children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          // @ts-ignore
          control: this.instance,
        })
      }

      return child
    })
  }
}

import React from 'react'
import Control from '../Control'
import { CopyrightControlProps } from './type'
import Item from './Item'

export * from './type'

/**
 * 表示版权控件，您可以在地图上添加自己的版权信息。每一个版权信息需要包含如下内容：版权的唯一标识、版权内容和其适用的区域范围。
 */
export default class CopyrightControl extends Control<CopyrightControlProps> {
  /**
   * 渲染Copyright内容
   */
  public static Item = Item

  public constructor(props: any) {
    super(props)
    this.instance = new BMap.CopyrightControl()
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

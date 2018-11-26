import { ControlProps } from '../Control'

export interface CopyrightControlProps extends ControlProps {
  /**
   * 放置CopyrightControl.Item
   */
  children: React.ReactNode
}

export interface CopyrightItemProps {
  // 会渲染成字符串，所以事件在这里无效
  children: React.ReactNode
  bounds?: BMap.Bounds
  /**
   * @ignore 由CopyrightControl注入
   */
  control?: BMap.CopyrightControl
}

以下是 CustomOverlay 的实现代码, 可以参考实现更复杂的用例:

```typescript
import React from 'react'
import ReactDOM from 'react-dom'
import Overlay, { PaneType } from 'react-bdmap/overlays/Overlay'

export interface CustomOverlayProps {
  /**
   * 设置标注的地理坐标. 这个坐标将作为自定义DOM元素的左上角, 可以通过offset或CSS translate设置偏移值
   */
  position: BMap.Point
  /**
   * 设置标注的偏移值
   */
  offset?: BMap.Size
  /**
   * 设置覆盖物的zIndex
   */
  zIndex?: number
  /**
   * 自定义DOM元素
   */
  children: React.ReactNode
  /**
   * 自定义覆盖物插入的容器
   */
  pane?: PaneType
}

/**
 * 惰性生成自定义覆盖物类, 该类需要继承BMap.Overlay, 按照百度地图的自定义覆盖物规范,
 * 实现**initialize** 和**draw**方法
 */
export function getClass() {
  return class extends BMap.Overlay {
    public position: BMap.Point
    public offset?: BMap.Size
    public elm: HTMLDivElement
    public pane: PaneType
    public map: BMap.Map

    /**
     * 自定义构造函数
     */
    public constructor(
      position: BMap.Point,
      elm: HTMLDivElement,
      pane: PaneType = 'markerPane',
    ) {
      super()
      this.position = position
      this.elm = elm
      this.pane = pane
    }

    /**
     * 初始化, 可以在这里注入到地图中
     */
    public initialize = (map: BMap.Map) => {
      this.elm.style.position = 'absolute'
      this.map = map
      ;(map.getPanes()[this.pane] as HTMLElement).appendChild(this.elm)
      return this.elm
    }

    /**
     * 在地图上绘制
     */
    public draw = () => {
      if (this.position == null || this.map == null) {
        return
      }

      // 将地图坐标转换为像素坐标
      const position = this.map.pointToOverlayPixel(this.position)
      const { width = 0, height = 0 } = this.offset || {}

      this.elm.style.left = `${position.x + width}px`
      this.elm.style.top = `${position.y + height}px`
    }

    public setPosition = (position: BMap.Point) => {
      this.position = position
      this.draw()
    }

    public setOffset = (offset: BMap.Size) => {
      this.offset = offset
      this.draw()
    }

    public setZIndex = (index: number) => {
      this.elm.style.zIndex = index.toString()
    }
  }
}

const PROPERTIES = ['position', 'offset', 'zIndex']

/**
 * 自定义覆盖物. 用于渲染自定义的DOM对象
 */
export default class CustomOverlay extends Overlay<CustomOverlayProps> {
  private elm = document.createElement('div')
  public static CustomOverlayInner: ReturnType<typeof getClass>

  // 在initialize 方法中创建实例
  protected initialize = () => {
    if (CustomOverlay.CustomOverlayInner == null) {
      CustomOverlay.CustomOverlayInner = getClass()
    }
    const { pane, position } = this.props
    this.extendedProperties = PROPERTIES
    this.instance = new CustomOverlay.CustomOverlayInner(
      position,
      this.elm,
      pane,
    )
  }

  protected customRender = () => {
    return ReactDOM.createPortal(this.props.children, this.elm)
  }
}
```

#### API 约定

| 成员                         | 类型                                     | 描述                                                                                                                                                                                                     |
| ---------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| instance                     | _BMap.Overlay_                           | 自定义覆盖物实例. 可以在 constructor 或 initialize 方法中进行构造                                                                                                                                        |
| context                      | _React.ContextType<typeof BDMapContext>_ | 可以通过 this.context.nativeInstance 获取 BMap.Map 对象                                                                                                                                                  |
| extendedProperties           | string[]                                 | 定义同步到 Overlay 实例的'setter'属性, 例如['position'], 会将 props 中的 position 通过 setPosition 设置到 Overlay 实例中                                                                                 |
| extendedEnableableProperties | string[]                                 | 定义同步到 Overlay 实例的'enableable'属性, 这些属性是 boolean 类型的, 例如['editing'], 当 enableEditing props 属性为 true 时, 会调用 Overlay 实例的 enableEditing() 方法, 反之调用 disableEditing() 方法 |
| extendedEvents               | string[]                                 | 设置绑定的事件名, 例如['dbl_click']会读取 onDoubleClick(React 规范事件名) props, 并绑定到 Overlay 实例的 ondblclick 事件.                                                                                |
| initialize                   | () => void                               | 在这里初始化 Overlay 实例以及设置 extendedEnableableProperties, extendedProperties, extendedProperties. 这个方法将在 componentDidMount 时调用                                                            |
| customRender                 | () => React.ReactNode                    | 等价于 render 方法, 可以用于实现 ReactDOM.Portal 模式                                                                                                                                                    |  

更多用法可以参考react-bdmap的[`覆盖物`](https://github.com/carney520/react-bdmap/tree/master/src/overlays)组件实现
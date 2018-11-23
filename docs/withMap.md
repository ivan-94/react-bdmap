_import withMap from 'react-bdmap/withMap'_

**withMap**是一个高阶组件，用于将当前上下文的`BMap.Map`实例注入到目标组件中。用于实现对地图组件的自定义控制.

```jsx
class CustomPlugin extends React.Component {
  componentDidMount() {
    const map = this.props.map
    // 添加自定义菜单
    const menu = new BMap.ContextMenu()
    const txtMenuItem = [
      {
        text: '放大',
        callback: function() {
          map.zoomIn()
        },
      },
      {
        text: '缩小',
        callback: function() {
          map.zoomOut()
        },
      },
    ]
    for (let i = 0; i < txtMenuItem.length; i++) {
      menu.addItem(new BMap.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, 100))
    }
    map.addContextMenu(menu)
  }

  render() {
    return null
  }
}

const CustomPluginWithMap = withMap(CustomPlugin)

;<UnderBDMap>
  <CustomPluginWithMap />
</UnderBDMap>
```

Typescript 使用示例

```typescript
import withMap, { WithMapInjectedProps } from 'react-bmap/withMap'

export interface MyPluginProps extends WithMapInjectedProps {
  // 自定义props
}

export class MyPlugin extends React.Component<MyPluginProps> {
  // 自定义代码
}

export default withMap(MyPlugin)
```

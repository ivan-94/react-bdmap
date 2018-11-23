baidu map 是通过`script`异步加载的, 应该使用`BDMapLoader`作为`BDMap`的上级，`BDMapLoader`会在加载成功后才会渲染子节点，
所以最佳实践是将`BDMap`放在单独的组件中， 这样可以确保可以安全地访问`window`下的`BMap`属性。如:

```jsx static
import React from 'react'
import BDMapLoader from 'react-bdmap/BDMapLoader'
import BDMap from 'react-bdmap/BDMap'

// 可以安全地在所有'实例属性'、'实例方法'中访问BMap
class MyMap extends React.Component {
  state = {
    center: new BMap.Point(123, 78),
  }

  render() {
    return <BMap center={this.state.center}>{/* controls, overlays */}</BMap>
  }
}

class MyApp {
  render() {
    return (
      <BDMapLoader
        apiKey="MY_KEY"
        fallback={err => {
          return err ? 'Failed to load' : 'Loading...'
        }}
      >
        <MyMap />
      </BDMapLoader>
    )
  }
}
```

使用 fallback 来自定义展示加载状态

```jsx
function App() {
  return (
    <BDMapLoader
      apiKey="1XWjAMBIusA3EL4G61lXS0AliZd0l7bF"
      fallback={error => (error ? `Failed to load: ${error}` : 'loading')}
    >
      <div>loaded</div>
    </BDMapLoader>
  )
}

class Example extends React.Component {
  constructor() {
    super()
    this.state = {
      show: false,
    }
  }

  render() {
    return (
      <div>
        {this.state.show && <App />}
        <div>
          <button onClick={() => this.setState({ show: true })}>show</button>
        </div>
      </div>
    )
  }
}

;<Example />
```

BDMap 必须作为 BDMapLoader 下级组件，保证 BMap 加载完毕后才开始渲染。一个 BMapLoader 下可以存在多个 BDMap 地图实例：

```jsx static
class MyMap extends React.Component {
  state = {
    center1: new BMap.Point(113.553717, 22.211009),
    center2: new BMap.Point(113.553717, 22.211009),
  }
  render() {
    return (
      <>
        <BDMap center={this.state.center1}>{/* controls, overlays */}</BDMap>
        <BDMap center={this.state.center2}>{/* controls, overlays */}</BDMap>
      </>
    )
  }
}

function App() {
  return (
    <BDMapLoader apiKey="XXX">
      <MyMap />
    </BDMapLoader>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
```

### 事件

BDMap 的所有事件绑定都采用 React 的事件规范，如`onclick` 对应的为`onClick`, `ondblclick`对应的为`onDoubleClick`. 具体组件的 API 文档

```
class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      center: new BMap.Point(116.404449, 39.914889),
      zoom: 12,
    }
  }

  render() {
    return (
      <>
        <BDMap
          style={{ height: 450 }}
          zoom={this.state.zoom}
          center={this.state.center}
          enableScrollWheelZoom
          onClick={logger('onClick')}
          onDoubleClick={logger('onDoubleClick')}
          onRightDoubleClick={logger('onRightDoubleClick')}
        />
      </>
    )
  }
}

;<BDMapWrapper>
  <Example />
</BDMapWrapper>
```

### 受控模式

zoom 和 center 可以支持受控模式

```jsx
class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      center: new BMap.Point(116.404449, 39.914889),
      zoom: 12,
    }
  }

  render() {
    return (
      <>
        <BDMap
          style={{ height: 450 }}
          zoom={this.state.zoom}
          center={this.state.center}
          enableScrollWheelZoom
          onZoomChange={zoom => this.setState({ zoom })}
          onCenterChange={center => {
            this.setState({ center })
            console.log('center change')
          }}
        />
        <div>Zoom: {this.state.zoom}</div>
        <div>
          center: {this.state.center.lng}, {this.state.center.lat}
        </div>
      </>
    )
  }
}

;<BDMapWrapper>
  <Example />
</BDMapWrapper>
```

### 示例

受控模式

```jsx
class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      center: new BMap.Point(116.404449, 39.914889),
      current: new BMap.Point(116.404449, 39.914889),
      animate: false,
    }
  }

  render() {
    return (
      <>
        <BDMap center={this.state.center} style={{ height: 500 }} zoom={15}>
          <Marker
            position={this.state.current}
            onChange={current => this.setState({ current })}
            enableDragging
            animation={this.state.animate ? BMAP_ANIMATION_BOUNCE : null}
          />
        </BDMap>

        <div style={{ padding: 10 }}>
          <div className="ui message">
            当前位置：{this.state.current.lng}, {this.state.current.lat}
          </div>
          <button
            className="ui button"
            onClick={() => this.setState({ animate: !this.state.animate })}
          >
            {this.state.animate ? '关闭动画' : '开启动画'}
          </button>
        </div>
      </>
    )
  }
}

;<BDMapWrapper>
  <Example />
</BDMapWrapper>
```

自定义图标

```jsx
class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      center: new BMap.Point(116.404449, 39.914889),
      icon: new BMap.Icon(
        'http://developer.baidu.com/map/jsdemo/img/fox.gif',
        new BMap.Size(300, 157),
        {},
      ),
    }
  }

  render() {
    return (
      <>
        <BDMap center={this.state.center} style={{ height: 500 }} zoom={15}>
          <Marker position={this.state.center} icon={this.state.icon} />
        </BDMap>
      </>
    )
  }
}

;<BDMapWrapper>
  <Example />
</BDMapWrapper>
```

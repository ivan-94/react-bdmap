除了使用 defaultOpen 控制默认打开状态, 还可以通过 changeView()方法命令式控制

```jsx
class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      center: new BMap.Point(116.404449, 39.914889),
      show: false,
    }
  }

  render() {
    return (
      <>
        <BDMap
          center={this.state.center}
          style={{ height: 450 }}
          zoom={12}
          enableScrollWheelZoom
        >
          {this.state.show && (
            <OverviewMapControl
              defaultOpen
              onViewChanged={logger('onViewChanged')}
              onViewChanging={logger('onViewChanging')}
            />
          )}
        </BDMap>
        <button onClick={() => this.setState({ show: !this.state.show })}>
          {this.state.show ? '关闭' : '开启'}
        </button>
      </>
    )
  }
}

;<BDMapWrapper>
  <Example />
</BDMapWrapper>
```

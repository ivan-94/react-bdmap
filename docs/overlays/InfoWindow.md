#### 基本使用

`InfoWindow`使用**open**和`onChange`props 来受控地显示和隐藏

```jsx
class Example extends React.Component {
  constructor() {
    super()
    this.state = {
      center: new BMap.Point(113.558514, 22.204535),
      current: new BMap.Point(113.558514, 22.204535),
      show: true,
    }
  }

  render() {
    return (
      <>
        <BDMap center={this.state.center} style={{ height: 450 }} zoom={15}>
          <InfoWindow
            open={this.state.show}
            onChange={show => this.setState({ show })}
            position={this.state.current}
            enableCloseOnClick={false}
            onClose={logger('onClose')}
            onOpen={logger('onOpen')}
            onMaximize={logger('onMaximize')}
            onRestore={logger('onRestore')}
            onClickclose={logger('onClickclose')}
          >
            hello infowindow
          </InfoWindow>
        </BDMap>
        <button onClick={() => this.setState({ show: !this.state.show })}>{this.state.show ? 'Hide' : 'Show'}</button>
        <button onClick={() => this.setState({ current: new BMap.Point(113.558855, 22.202845) })}>
          change position
        </button>
      </>
    )
  }
}

;<BDMapWrapper>
  <Example />
</BDMapWrapper>
```

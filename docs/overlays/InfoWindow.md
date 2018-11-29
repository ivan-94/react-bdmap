#### 基本使用

`InfoWindow`使用**open**和**onChange** 来受控地显示和隐藏. 但是同时只能显示一个 InfoWindow

```jsx
class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      center: new BMap.Point(113.558514, 22.204535),
      position1: new BMap.Point(113.558514, 22.204535),
      position2: new BMap.Point(113.558514, 22.205535),
      showWindow1: true,
      showWindow2: true,
      content: 'Info Window 1',
    }
  }

  render() {
    return (
      <>
        <BDMap
          center={this.state.center}
          style={{ height: 450 }}
          zoom={15}
          enableScrollWheelZoom
        >
          <InfoWindow
            title={<h2>Window 1</h2>}
            open={this.state.showWindow1}
            onChange={show => this.setState({ showWindow1: show })}
            position={this.state.position1}
            enableCloseOnClick={false}
            onClose={logger('onClose Window 1')}
            onOpen={logger('onOpen Window 1')}
            onMaximize={logger('onMaximize')}
            onRestore={logger('onRestore')}
            onClickClose={logger('onClickclose')}
          >
            {this.state.content}
          </InfoWindow>
          <InfoWindow
            title={<h2>Window 2</h2>}
            position={this.state.position2}
            open={this.state.showWindow2}
            onChange={show => this.setState({ showWindow2: show })}
            onClose={logger('onClose Window 2')}
            onOpen={logger('onOpen Window 2')}
          >
            Info Window 2
          </InfoWindow>
        </BDMap>

        <div style={{ padding: 10 }}>
          <button
            className="ui button"
            onClick={() =>
              this.setState({ showWindow1: !this.state.showWindow1 })
            }
          >
            Window 1 {this.state.showWindow1 ? 'Hide' : 'Show'}
          </button>
          <button
            className="ui button"
            onClick={() =>
              this.setState({ showWindow2: !this.state.showWindow2 })
            }
          >
            Window 2 {this.state.showWindow2 ? 'Hide' : 'Show'}
          </button>
          <button
            className="ui button"
            onClick={() =>
              this.setState({
                position1: new BMap.Point(113.558855, 22.202845),
              })
            }
          >
            Change Window1 position
          </button>
          <div className="ui divider" />
          <div className="ui input">
            <input
              type="text"
              placeholder="Content of Window 1"
              value={this.state.content}
              onChange={evt => this.setState({ content: evt.target.value })}
            />
          </div>
        </div>
      </>
    )
  }
}

;<BDMapWrapper>
  <Example />
</BDMapWrapper>
```

InfoWindow 可以作为其他 Overlay 直接子级, 复用它们的位置

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
          <Marker
            position={this.state.current}
            enableDragging
            onChange={v => this.setState({ current: v })}
          >
            <InfoWindow
              open={this.state.show}
              onChange={show => this.setState({ show })}
              onClose={logger('onClose')}
              onOpen={logger('onOpen')}
            >
              under marker
            </InfoWindow>
          </Marker>
        </BDMap>
        <button onClick={() => this.setState({ show: !this.state.show })}>
          {this.state.show ? 'Hide' : 'Show'}
        </button>
      </>
    )
  }
}

;<BDMapWrapper>
  <Example />
</BDMapWrapper>
```

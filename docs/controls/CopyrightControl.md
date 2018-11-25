```jsx
class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      center: new BMap.Point(116.404449, 39.914889),
      bounds: new BMap.Bounds(new BMap.Point(116.3646,39.907076), new BMap.Point(116.438045,39.955211)),
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
            <CopyrightControl anchor={BMAP_ANCHOR_BOTTOM_RIGHT}>
              <CopyrightControl.Item>在任何区域都可见</CopyrightControl.Item>
              <CopyrightControl.Item bounds={this.state.bounds}>北京一环可见</CopyrightControl.Item>
            </CopyrightControl>
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

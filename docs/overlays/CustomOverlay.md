自定义元素将 position 作为左上角进行定位, 如果要居中显示可以使用 offset, 或者 CSS 的 transform, margin 等属性设置偏移.

```jsx
class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      center: new BMap.Point(116.404449, 39.914889),
      mapStyle: {features: ['land'], style: 'normal'},
      count: 0,
    }
    this.handleClick = this.handleClick.bind(this)
  }

  render() {
    return (
      <>
        <BDMap
          center={this.state.center}
          style={{ height: 500 }}
          zoom={15}
          enableDoubleClickZoom={false}
          mapStyle={this.state.mapStyle}
        >
          <Marker position={this.state.center} />
          <CustomOverlay position={this.state.center}>
            <button
              className="ui button"
              style={{ whiteSpace: 'nowrap', transform: `translateX(-50%)` }}
              onClick={this.handleClick}
            >
              Click count: {this.state.count}
            </button>
          </CustomOverlay>
        </BDMap>
      </>
    )
  }

  handleClick(evt) {
    evt.stopPropagation()
    evt.preventDefault();
    this.setState({ count: this.state.count + 1 })
  }
}

;<BDMapWrapper>
  <Example />
</BDMapWrapper>
```

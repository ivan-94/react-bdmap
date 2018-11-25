
zoom和center可以支持受控模式

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
          onZoomChange={(zoom) => this.setState({zoom})}
          onCenterChange={(center) => {this.setState({center}); console.log('center change')}}
        >
        </BDMap>
        <div>Zoom: {this.state.zoom}</div>
        <div>center: {this.state.center.lng}, {this.state.center.lat}</div>
      </>
    )
  }
}

;<BDMapWrapper>
  <Example />
</BDMapWrapper>
```
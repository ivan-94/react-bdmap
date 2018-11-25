官方示例:

```jsx
class Example extends React.Component {
  constructor() {
    super()
    this.state = {
      center: new BMap.Point(116.404449, 39.914889),
      show: false,
      bounds: new BMap.Bounds(new BMap.Point(116.29579,39.837146), new BMap.Point(116.475451,39.9764)),
    }
  }

  render() {
    return (
      <>
        <BDMap center={this.state.center} style={{ height: 450 }} zoom={12} enableScrollWheelZoom>
          {this.state.show &&
            <GroundOverlay
              bounds={this.state.bounds}
              imageURL="http://lbsyun.baidu.com/jsdemo/img/si-huan.png"
              opacity={1}
              displayOnMinLevel={10}
              displayOnMaxLevel={14}
            />
          }
        </BDMap>
        <button onClick={() => this.setState({show: !this.state.show})}>
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
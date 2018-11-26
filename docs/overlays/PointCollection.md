官方示例：

```jsx
class Example extends React.Component {
  constructor() {
    super()
    this.state = {
      center: new BMap.Point(105.0, 38.0),
      show: false,
      points: [],
      styles: {
        size: BMAP_POINT_SIZE_SMALL,
        shape: BMAP_POINT_SHAPE_STAR,
        color: '#d340c3',
      },
    }
  }

  componentDidMount() {
    this.loadData()
  }

  render() {
    return (
      <>
        <BDMap
          center={this.state.center}
          style={{ height: 450 }}
          zoom={5}
          enableScrollWheelZoom
        >
          {this.state.show && (
            <PointCollection
              points={this.state.points}
              styles={this.state.styles}
            />
          )}
        </BDMap>
        <button onClick={() => this.setState({ show: !this.state.show })}>
          {this.state.show ? '关闭' : '开启'}
        </button>
      </>
    )
  }

  loadData() {
    importScript('https://lbsyun.baidu.com/jsdemo/data/points-sample-data.js')
      .then(() => {
        const points = []
        for (let i = 0; i < window.data.data.length; i++) {
          points.push(
            new BMap.Point(window.data.data[i][0], window.data.data[i][1]),
          )
        }
        this.setState({ points })
      })
      .catch(error => {
        console.log(error)
      })
  }
}

;<BDMapWrapper>
  <Example />
</BDMapWrapper>
```

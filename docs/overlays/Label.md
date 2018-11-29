### 示例： 台风 24 小时、48 小时警戒线

```jsx
const POINTS_24 = [[127, 34], [127, 22], [110, 15]]
const POINTS_48 = [[132, 34], [132, 22], [125, 15], [110, 15]]
const fontStyle = {
  border: 'none',
  backgroundColor: 'transparent',
  width: '1em',
  whiteSpace: 'pre-line',
}

const fontStyle24 = { ...fontStyle, color: 'yellow' }
const fontStyle48 = { ...fontStyle, color: 'blue' }

class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      center: new BMap.Point(114.139389, 22.436661),
      guardLine24: POINTS_24.map(p => new BMap.Point(p[0], p[1])),
      guardLine48: POINTS_48.map(p => new BMap.Point(p[0], p[1])),
    }
  }

  render() {
    return (
      <>
        <BDMap center={this.state.center} style={{ height: 500 }} zoom={5}>
          <Polyline
            path={this.state.guardLine24}
            strokeColor="yellow"
            strokeWeight={2}
          />
          <Label
            position={this.state.guardLine24[0]}
            content="24小时警戒线"
            style={fontStyle24}
          />
          <Polyline
            path={this.state.guardLine48}
            strokeColor="blue"
            strokeWeight={2}
          />
          <Label
            position={this.state.guardLine48[0]}
            content="48小时警戒线"
            style={fontStyle48}
          />
        </BDMap>
      </>
    )
  }
}

;<BDMapWrapper>
  <Example />
</BDMapWrapper>
```

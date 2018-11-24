### Example

```jsx
class Example extends React.Component {
  constructor() {
    super()
    this.state = {
      center: new BMap.Point(116.404, 39.915),
      show: false,
    }
  }

  render() {
    return (
      <>
        <BDMap center={this.state.center} style={{ height: 450 }} zoom={15}>
          {this.state.show &&
            <TrafficLayer />
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
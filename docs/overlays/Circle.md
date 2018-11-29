### 示例

```jsx
class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      center: new BMap.Point(116.404449, 39.914889),
      radius: 1000,
      show: false,
    }
  }

  render() {
    return (
      <>
        <BDMap center={this.state.center} style={{ height: 500 }} zoom={15}>
          <Circle center={this.state.center} radius={this.state.radius} />
        </BDMap>

        <div style={{ padding: 10 }}>
          <button
            className="ui button"
            onClick={() => this.setState({ radius: this.state.radius + 500 })}
          >
            + 500m
          </button>
          <button
            className="ui button"
            onClick={() => this.setState({ radius: this.state.radius - 500 })}
          >
            - 500m
          </button>
        </div>
      </>
    )
  }
}

;<BDMapWrapper>
  <Example />
</BDMapWrapper>
```

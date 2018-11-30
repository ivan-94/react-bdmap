```jsx
class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selecting: false,
      editing: false,
      center: new BMap.Point(116.404449, 39.914889),
      path: [],
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
          enableScrollWheelZoom
          onClick={this.handleClick}
        >
          <Polygon
            path={this.state.path}
            enableEditing={this.state.editing}
            onChange={path => this.setState({ path })}
          />
        </BDMap>

        <div style={{ padding: 10 }}>
          <button
            className="ui button"
            onClick={() => this.setState({ selecting: !this.state.selecting })}
          >
            {this.state.selecting ? '关闭点击选择' : '开启点击选择'}
          </button>
          <button
            className="ui button"
            onClick={() => this.setState({ editing: !this.state.editing })}
          >
            {this.state.editing ? '关闭编辑' : '开启编辑'}
          </button>
        </div>
      </>
    )
  }

  handleClick(evt) {
    if (!this.state.selecting) {
      return
    }

    const path = this.state.path.concat(evt.point)
    this.setState({ path })
  }
}

;<BDMapWrapper>
  <Example />
</BDMapWrapper>
```

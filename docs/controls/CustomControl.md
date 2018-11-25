使用 CustomControl 可以方便地实现自定义控件:

```jsx
/**
 * 自定义控件
 */
class CountControl extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0,
    }
  }

  render() {
    return (
      <CustomControl {...this.props}>
        <div
          style={{ background: 'gray', padding: '10px' }}
          onClick={() => this.setState({ count: this.state.count + 1 })}
        >
          Current Count: {this.state.count}
        </div>
      </CustomControl>
    )
  }
}

class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      center: new BMap.Point(116.404449, 39.914889),
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
            <CountControl anchor={BMAP_ANCHOR_BOTTOM_RIGHT} />
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

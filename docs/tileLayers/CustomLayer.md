```jsx
class Example extends React.Component {
  constructor() {
    super()
    this.input = React.createRef()
    this.state = {
      center: new BMap.Point(113.603901,22.364629),
      show: false,
      q: '',
    }
    this.handleSubmit = (evt) => {
      evt.preventDefault()
      this.setState({
        q: this.input.current.value
      })
    }
  }

  render() {
    return (
      <>
        <BDMap center={this.state.center} style={{ height: 450 }} zoom={14}>
          {this.state.show &&
            <CustomLayer
              geotableId="196898"
              q={this.state.q}
              onHotspotclick={logger('onHotspotclick')}
            />
          }
          <NavigationControl/>
        </BDMap>

        <button onClick={() => this.setState({show: !this.state.show})}>
          {this.state.show ? '关闭' : '开启'}
        </button>
        <form onSubmit={this.handleSubmit} style={{display: 'inline', marginLeft: '10px'}}>
          <input 
            ref={this.input}
            placeholder="搜索" 
          />
        </form>
      </>
    )
  }
}

;<BDMapWrapper>
  <Example />
</BDMapWrapper>
```

> Note: CustomLayer和其他组件不一样，当props变动时会重新创建CustomLayer对象, 从而触发云端检索数据,
> 所以要避免props频繁变动
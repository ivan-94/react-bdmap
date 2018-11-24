官方示例: 清华校园微观图

```jsx
class Example extends React.Component {
  constructor() {
    super()
    this.state = {
      center: new BMap.Point(116.332782, 40.007978),
      show: false,
    }
  }

  render() {
    return (
      <>
        <BDMap center={this.state.center} style={{ height: 450 }} zoom={15}>
          {this.state.show &&
            <>
              <CustomTileLayer
                getTilesUrl={(tileCoord, zoom) => {
                  // 根据当前坐标, 选取合适的瓦片图
                  return `http://lbsyun.baidu.com/jsdemo/demo/tiles/${zoom}/tile${tileCoord.x}_${tileCoord.y}.png`
                }}
              />
              <CopyrightControl anchor={BMAP_ANCHOR_BOTTOM_RIGHT}>
                <CopyrightControl.Item>版权说明：清华校园图片取自互联网</CopyrightControl.Item>
              </CopyrightControl>
            </>
          }
          <NavigationControl/>
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
> Note: 目前的实现原理是按照 React 组件渲染的顺序添加 Item 和 Separator, 所以不要在 ContextMenu 执行条件渲染,
> 避免乱序

为地图添加右键菜单

```jsx
class Example extends React.Component {
  constructor() {
    super()
    this.state = {
      center: new BMap.Point(113.558514, 22.204535),
    }
    this.map = React.createRef()
    this.handleZoom = () => {
      this.map.current.getMap().zoomIn()
    }
  }

  render() {
    return (
      <>
        <BDMap ref={this.map} center={this.state.center} style={{ height: 450 }} zoom={15}>
          <ContextMenu onOpen={logger('onOpen')} onClose={logger('onClose')}>
            <ContextMenu.Item onClick={this.handleZoom}>放大</ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item disabled>缩小</ContextMenu.Item>
          </ContextMenu>
        </BDMap>
      </>
    )
  }
}

;<BDMapWrapper>
  <Example />
</BDMapWrapper>
```

作为 Marker 的右键菜单

```jsx
class Example extends React.Component {
  constructor() {
    super()
    this.state = {
      center: new BMap.Point(113.558514, 22.204535),
    }
  }

  render() {
    return (
      <>
        <BDMap center={this.state.center} style={{ height: 450 }} zoom={15}>
          <Marker position={this.state.center}>
            <ContextMenu>
              <ContextMenu.Item>Foo</ContextMenu.Item>
              <ContextMenu.Separator />
              <ContextMenu.Item disabled>Bar</ContextMenu.Item>
              <ContextMenu.Separator />
              <ContextMenu.Item>Baz</ContextMenu.Item>
            </ContextMenu>
          </Marker>
        </BDMap>
      </>
    )
  }
}

;<BDMapWrapper>
  <Example />
</BDMapWrapper>
```

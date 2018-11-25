#### Methods

| Method name                                  | Description                                     |
| -------------------------------------------- | ----------------------------------------------- |
| location(): void                             | 开始定位                                        |
| getAddressComponent(): BMap.AddressComponent | 返回当前的定位信息。若当前还未定位，则返回 null |

#### Example

```jsx
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
            <GeolocationControl
              showAddressBar
              enableAutoLocation
              onLocationSuccess={logger('onLocationSuccess')}
              onLocationError={logger('onLocationError')}
            />
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

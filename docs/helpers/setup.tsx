import React from 'react'
import BDMapLoader from '../../src/BDMapLoader'
// import BDMap from '../../src/BDMap'

// class Map extends React.Component {
//   public state = {
//     center: new BMap.Point(113.558514, 22.204535),
//   }
//   public render() {
//     return (
//       <BDMap center={this.state.center} zoom={15} style={{ height: '500px' }}>
//         {this.props.children}
//       </BDMap>
//     )
//   }
// }

// @ts-ignore
global.BDMapWrapper = class extends React.Component {
  public render() {
    return (
      <div style={{ height: 500 }}>
        <BDMapLoader apiKey="1XWjAMBIusA3EL4G61lXS0AliZd0l7bF">{this.props.children}</BDMapLoader>
      </div>
    )
  }
}

// @ts-ignore
global.logger = (action: string) => (...args: any[]) => {
  console.log(`${action}: `, ...args)
}

import React from 'react'
import ReactDOM from 'react-dom'
import BDMap from '../src/BDMap'
import NavigationControl from '../src/NavigationControl'
import './style.css'
import { Coord } from '../src/type'

class App extends React.Component {
  public state: {
    center?: Coord
    zoom: number
    dragging: boolean
    mapStyle?: number
    clickHandler?: (evt: any) => void
    anchor?: BMap.ControlAnchor
  } = {
    center: {
      lat: 39.915,
      lng: 116.404,
    },
    dragging: true,
    zoom: 15,
  }
  public render() {
    return (
      <div className="map-container">
        <BDMap
          apiKey="U5j28cHwGZAm7bjF043WQifp46S5hI09"
          style={{ width: '100%', height: '100%', position: 'relative' }}
          onReady={this.handleReady}
          // @ts-ignore
          center={this.state.center}
          zoom={this.state.zoom}
          enableScrollWheelZoom
          enableDragging={this.state.dragging}
          mapStyle={this.state.mapStyle}
          onClick={this.state.clickHandler}
        >
          <NavigationControl anchor={this.state.anchor} enableGeolocation />
        </BDMap>
        <div>
          <button
            onClick={() => {
              this.setState({ zoom: this.state.zoom + 1 })
            }}
          >
            + zoom
          </button>
          <button
            onClick={() => {
              this.setState({ zoom: this.state.zoom - 1 })
            }}
          >
            - zoom
          </button>
          <button
            onClick={() => {
              this.setState({ dragging: !this.state.dragging })
            }}
          >
            toggle dragging
          </button>
          <button onClick={this.handleMove}>move</button>
          <button onClick={() => this.setState({ clickHandler: (v: any) => console.log(v) })}>add Click Handler</button>
          <button onClick={() => this.setState({ clickHandler: undefined })}>remove Click Handler</button>
          <hr />
          <button onClick={() => this.setState({ anchor: BMAP_ANCHOR_BOTTOM_LEFT })}>←</button>
          <button onClick={() => this.setState({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT })}>→</button>
          <button onClick={() => this.setState({ anchor: undefined })}>default</button>
        </div>
      </div>
    )
  }

  private handleReady = () => {
    const center = new BMap.Point(116.404, 39.915)
    this.setState({ center })
  }

  private handleMove = () => {
    const center = this.state.center
    if (center) {
      this.setState({ center: new BMap.Point(center.lng + Math.random(), center.lat + Math.random()) })
    }
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

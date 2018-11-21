import React from 'react'
import ReactDOM from 'react-dom'
import BDMap from '../src/BDMap'
import './style.css'
import { Coord } from '../src/type'

class App extends React.Component {
  public state: {
    center?: Coord
    zoom: number
  } = {
    center: {
      lat: 39.915,
      lng: 116.404,
    },
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
        />
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
        </div>
      </div>
    )
  }

  private handleReady = () => {
    const center = new BMap.Point(116.404, 39.915)
    this.setState({ center })
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

import React from 'react'
import ReactDOM from 'react-dom'
import BDMap from '../src/BDMap'
import NavigationControl from '../src/controls/NavigationControl'
import OverviewMapControl from '../src/controls/OverviewMapControl'
import ScaleControl from '../src/controls/ScaleControl'
import MapTypeControl from '../src/controls/MapTypeControl'
import CopyrightControl from '../src/controls/CopyrightControl'
import GeolocationControl from '../src/controls/GeolocationControl'
import CustomControl from '../src/controls/CustomControl'
import Marker from '../src/overlays/Marker'
import './style.css'
import Label from '../src/overlays/Label'
import Polyline from '../src/overlays/Polyline'
import Polygon from '../src/overlays/Polygon'
import Circle from '../src/overlays/Circle'

function log(e: any) {
  console.log(e)
}

class App extends React.Component {
  public state: {
    center?: BMap.Point
    current?: BMap.Point
    zoom: number
    count: number
    dragging: boolean
    mapStyle?: number
    clickHandler?: (evt: any) => void
    anchor?: BMap.ControlAnchor
    showControls?: boolean
    bounds?: BMap.Bounds
  } = {
    count: 0,
    dragging: true,
    zoom: 15,
    showControls: true,
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
          {() => {
            return (
              <>
                {this.state.showControls && (
                  <>
                    <NavigationControl anchor={this.state.anchor} enableGeolocation />
                    <CustomControl anchor={BMAP_ANCHOR_BOTTOM_RIGHT}>
                      <div onClick={this.handleCustomControlClick}>hello CustomControl {this.state.count}</div>
                    </CustomControl>
                    <ScaleControl />
                    <MapTypeControl />
                    <GeolocationControl onLocationSuccess={log} onLocationError={log} />
                    <CopyrightControl>
                      {!!this.state.bounds && (
                        <CopyrightControl.Copyright bounds={this.state.bounds}>
                          <div style={{ background: 'red' }}>测试Copyright</div>
                        </CopyrightControl.Copyright>
                      )}
                    </CopyrightControl>
                    <OverviewMapControl
                      defaultOpen
                      onViewchanged={() => {
                        console.log('view changed')
                      }}
                    />
                    {!!this.state.current && (
                      <>
                        <Marker
                          position={this.state.current}
                          enableDragging
                          onChange={this.handleCurrentChange}
                          title="test"
                        />
                        <Label position={this.state.current} content="label" />
                      </>
                    )}
                    <Circle center={this.state.center} radius={100} fillOpacity={0.7} fillColor="gree" />
                    <Polyline
                      strokeColor="red"
                      path={[new BMap.Point(116.403335, 39.916319), new BMap.Point(116.405616, 39.91563)]}
                    />
                    <Polygon
                      strokeColor="blue"
                      fillColor="yellow"
                      fillOpacity={0.6}
                      path={[
                        new BMap.Point(116.403335, 39.916319),
                        new BMap.Point(116.405616, 39.91563),
                        new BMap.Point(116.405365, 39.913908),
                        new BMap.Point(116.399508, 39.913915),
                      ]}
                    />
                  </>
                )}
              </>
            )
          }}
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
          <button onClick={() => this.setState({ showControls: !this.state.showControls })}>toggle visible</button>
        </div>
      </div>
    )
  }

  private handleReady = (map: BMap.Map) => {
    const center = new BMap.Point(116.404, 39.915)
    this.setState({ center, current: center })
    setTimeout(() => {
      this.setState({ bounds: map.getBounds() })
    }, 1000)
  }

  private handleCurrentChange = (value: BMap.Point) => {
    this.setState({ current: value })
  }

  private handleCustomControlClick = () => {
    this.setState({ count: this.state.count + 1 })
  }

  private handleMove = () => {
    const center = this.state.center
    if (center) {
      this.setState({ center: new BMap.Point(center.lng + Math.random(), center.lat + Math.random()) })
    }
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

import React, { FC, useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import { BDMapLoader, BDMap, Polyline, Marker, ScaleControl, NavigationControl, Clusterer } from '../../src'

import './style.css'

const Map: FC = props => {
  const [center] = useState(() => new BMap.Point(116.404269, 39.915378))
  const [points, setPoints] = useState<BMap.Point[]>(() => {
    let pts = []
    for (let i = 0; i < 30; i++) {
      pts.push(new BMap.Point(center.lng, center.lat))
    }
    return pts
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setPoints(points => {
        const pts = [...points]
        for (let i = 0; i < pts.length; i++) {
          const shoudUpdate = Math.floor((Math.random() * 100) % 4) === 0
          if (shoudUpdate) {
            const mup = (i % 2 === 0 ? -1 : 1) * 0.001
            pts[i] = new BMap.Point(center.lng + mup * Math.random(), center.lat + mup * Math.random())
          }
        }
        return pts
      })
    }, 5000)

    // return () => clearInterval(timer)
  }, [])

  return (
    <BDMap className="map" center={center} enableScrollWheelZoom>
      <ScaleControl />
      <NavigationControl />
      <Clusterer
        render={nodes => {
          return <div style={{ background: 'blue', color: 'white', width: 100, height: 100 }}>{nodes.length}</div>
        }}
        maxZoom={19}
      >
        {points.map((i, idx) => {
          return (
            <React.Fragment key={idx}>
              <Polyline path={[center, i]} strokeColor="red" strokeWeight={3} />
              <Marker position={i} />
            </React.Fragment>
          )
        })}
      </Clusterer>
    </BDMap>
  )
}

function MapLoader() {
  return (
    <BDMapLoader apiKey="U5j28cHwGZAm7bjF043WQifp46S5hI09" fallback={() => <div>loading</div>}>
      <Map />
    </BDMapLoader>
  )
}

function App() {
  return <MapLoader />
}

ReactDOM.render(<App />, document.getElementById('root'))

import React, { FC, useState, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'

import { BDMapLoader, BDMap, Polyline, Marker, CustomOverlay, ScaleControl, NavigationControl } from '../src'

import './style.css'

const AvatarOverlay: FC<{ position: BMap.Point }> = props => {
  return (
    <CustomOverlay position={props.position}>
      <img src="https://fs.mygzb.com:9091/fs/get?file_id=660339725427220480_headImg" width="30" height="30" />
    </CustomOverlay>
  )
}

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
          const mup = i % 2 === 0 ? -1 : 1
          if (Math.random() > 0.5) {
            pts[i] = new BMap.Point(center.lng + mup * Math.random(), center.lat + mup * Math.random())
          }
        }
        return pts
      })
    }, 500)

    return () => clearInterval(timer)
  }, [])

  return (
    <BDMap className="map" center={center} enableScrollWheelZoom>
      <ScaleControl />
      <NavigationControl />
      {points.map((i, idx) => {
        return (
          <React.Fragment key={idx}>
            <Polyline path={[center, i]} strokeColor="red" strokeWeight={3} />
            <Marker position={i} />
            <AvatarOverlay position={i} />
          </React.Fragment>
        )
      })}
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

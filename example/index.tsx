import React from 'react'
import ReactDOM from 'react-dom'
import BDMapLoader from '../src/BDMapLoader'
import MyMap from './MyMap'
import './style.css'

function App() {
  return (
    <BDMapLoader
      apiKey="U5j28cHwGZAm7bjF043WQifp46S5hI09"
      fallback={error => <div>{error ? 'loaded failed' : 'loading'}</div>}
    >
      <MyMap />
    </BDMapLoader>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

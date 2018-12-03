<p align="center"> 
  <img src="https://github.com/carney520/react-bdmap/blob/master/logo.png?raw=true" width="180px" height="180px" />
</p>
<p align="center"> Baidu Map Components for React </p>

# React Baidu Map

[![npm](https://img.shields.io/npm/v/react-bdmap.svg)](https://www.npmjs.com/package/react-bdmap)
[![npm](https://img.shields.io/npm/dm/react-bdmap.svg)](https://www.npmjs.com/package/react-bdmap)
[![license](https://img.shields.io/github/license/carney520/react-bdmap.svg)](https://github.com/carney520/react-bdmap)
[![circleCI](https://img.shields.io/circleci/project/github/carney520/react-bdmap.svg)](https://circleci.com/gh/carney520/react-bdmap/tree/master)

> react-bdmap 是基于 React 封装的百度地图组件库. 以 React 组件化的思维来, 声明式地开发地图应用. 除了内置组件,
> react-bdmap 也封装了一些易用的组件帮助实现自定义地图组件. 欢迎交流或贡献代码

## Requirement

'react & react-dom' > 16.6

## 安装

```shell
npm install react-bdmap --save

# by yarn
yarn add react-bdmap
```

<br/>

## 基本使用

```jsx static
import React from 'react'
import ReactDOM from 'react-dom'
import {
  BDMapLoader,
  BDMap,
  GeolocationControl,
  MapTypeControl,
  Marker,
  CustomOverlay,
  TrafficLayer
} from 'react-bdmap'

/**
 * 地图渲染, BDMapLoader会在依赖加载完成后才会渲染子级, 所以在这个组件的'实例方法'中可以
 * 安全地方法百度地图SDK 的 BMap全局变量.
 */
class MyMap extends React.Components {
  state = {
    defaultCenter: new BMap.Point(116.402544, 39.928216})
  }
  render() {
    return (<BDMap center={this.state.defaultCenter} zoom={15}>
      {/* 控件 */}
      <GeolocationControl />
      <MapTypeControl />
      {/* 覆盖物 */ }
      <Marker position={this.state.defaultCenter} />
      <CustomOverlay position={this.state.defaultCenter}>
        <div style={{color: 'red'}}>hello world</div>
      </CustomOverlay>
      {/* 图层 */}
      <TrafficLayer />
    </BDMap>)
  }
}

/**
 * 初始化百度地图, 使用script标签导入百度地图依赖
 */
function App(props) {
  return (
    <BDMapLoader
      apiKey="API_KEY"
      fallback={err => (err ? '加载失败' : '加载中...')}
    >
      <MyMap />
    </BDMapLoader>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
```

<br/>

### 按需导入

所有组件都支持按照`lodash`的风格进行导入. 例如:

```jsx static
import BDMap from 'react-bdmap/BDMap'
import CustomOverlay from 'react-bdmap/overlays/CustomOverlay'
```

详细模块结构:

```shell
react-bdmap
├── index.js
├── BDMapLoader               # 地图加载器
├── BDMap                     # 地图实例
├── ContextMenu               # 右键菜单
├── controls                  # 控件
│   ├── Control
│   ├── CopyrightControl
│   ├── CustomControl
│   ├── GeolocationControl
│   ├── MapTypeControl
│   ├── NavigationControl
│   ├── OverviewMapControl
│   └── ScaleControl
├── overlays                 # 覆盖物
│   ├── CanvasLayer
│   ├── Circle
│   ├── CustomOverlay
│   ├── GroundOverlay
│   ├── InfoWindow
│   ├── Label
│   ├── Marker
│   ├── Overlay
│   ├── PointCollection
│   ├── Polygon
│   └── Polyline
├── tileLayers              # 图层
│   ├── CustomLayer
│   ├── CustomTileLayer
│   ├── TileLayer
│   └── TrafficLayer
└── withMap                 # 高阶组件, 注入BMap.Map实例
```

<br/>

## 文档

[https://carney520.github.io/react-bdmap/](https://carney520.github.io/react-bdmap/)

<br/>

## Typescript 支持

`react-bdmap`使用 Typescript 编写, npm 包中已经包含了声明文件. 另外需要安装百度地图 sdk 声明文件

```shell
yarn add @types/baidumap-web-sdk @types/react @types/react-dom -D
```

<br/>

## License

MIT

Copyright (c) 2018-present

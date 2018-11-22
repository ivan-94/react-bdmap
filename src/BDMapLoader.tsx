/**
 * 初始化和加载baidu地图
 */
import React from 'react'
import { delay, importScript } from './utils'

declare global {
  interface Window {
    loadBDMap?: () => void
    BMap: typeof BMap
  }
}

export interface BDMapLoaderProps {
  // api key
  apiKey: string
  // loading or load failed
  fallback?: (error?: Error) => React.ReactNode
}

interface State {
  loaded: boolean
  error?: Error
}

const DEFAULT_RETRY_TIME = 3

export default class BDMapLoader extends React.Component<BDMapLoaderProps> {
  public state: State = {
    loaded: !!window.BMap,
  }

  public constructor(props: BDMapLoaderProps) {
    super(props)
    if (this.props.apiKey == null) {
      throw new TypeError('BDMap: apiKey is required')
    }
  }

  public componentDidMount() {
    if (window.BMap == null) {
      this.loadMap()
      return
    }
  }

  public render() {
    return this.state.loaded ? (
      this.props.children
    ) : this.props.fallback ? (
      this.props.fallback(this.state.error)
    ) : this.state.error ? (
      <div style={{ color: 'red' }}>{this.state.error.message}</div>
    ) : null
  }

  /**
   * load bdmap in script tag
   */
  private async loadMap() {
    const src = `//api.map.baidu.com/api?v=3.0&ak=${this.props.apiKey}&callback=loadBDMap`
    window.loadBDMap = this.finish
    for (let i = 0; i < DEFAULT_RETRY_TIME; i++) {
      try {
        await importScript(src)
        break
      } catch (error) {
        if (i === DEFAULT_RETRY_TIME - 1) {
          // 加载失败提示
          this.setState({ error: new Error(`Failed to load Baidu Map: ${error.message}`) })
        }
        await delay(i * 1000)
      }
    }
  }

  private finish = () => {
    this.setState({
      loaded: true,
    })
  }
}

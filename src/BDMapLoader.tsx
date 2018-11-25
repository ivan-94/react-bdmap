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
  /**
   * 你注册的API_KEY
   */
  apiKey: string
  /**
   * 用于展示加载中或错误状态
   */
  fallback?: (error?: Error) => React.ReactNode
}

interface State {
  loaded: boolean
  error?: Error
}

const DEFAULT_RETRY_TIME = 3

/**
 * BDMapLoader 用于加载百度地图依赖
 */
export default class BDMapLoader extends React.Component<BDMapLoaderProps> {
  /**
   * 全局可能存在多个Loader同时渲染, 但是只能由一个负责加载
   */
  private static waitQueue: Array<[Function, Function]> = []
  /**
   * 等待BMap就绪
   */
  public static async ready() {
    if (window.BMap) {
      return
    }

    return new Promise((res, rej) => {
      BDMapLoader.waitQueue.push([res, rej])
    })
  }

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
      if (window.loadBDMap) {
        BDMapLoader.waitQueue.push([this.finish, this.handleError])
        return
      }

      this.loadMap()
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
    window.loadBDMap = () => {
      // flush queue
      const queue = BDMapLoader.waitQueue
      BDMapLoader.waitQueue = []
      queue.forEach(task => task[0]())
      this.finish()
    }

    for (let i = 0; i < DEFAULT_RETRY_TIME; i++) {
      try {
        await importScript(src)
        break
      } catch (error) {
        if (i === DEFAULT_RETRY_TIME - 1) {
          const err = new Error(`Failed to load Baidu Map: ${error.message}`)
          // flush queue
          const queue = BDMapLoader.waitQueue
          BDMapLoader.waitQueue = []
          queue.forEach(task => task[1](err))
          this.handleError(err)
          return
        }
        await delay(i * 1000)
      }
    }
  }

  private handleError = (error: Error) => {
    this.setState({ error })
  }

  private finish = () => {
    this.setState({
      loaded: true,
    })
  }
}

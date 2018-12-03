import upperFirst from 'lodash/upperFirst'
import memoize from 'lodash/memoize'
import isEqualWith from 'lodash/isEqualWith'
import isObject from 'lodash/isObject'

const UA = navigator.userAgent.toLowerCase()
export const isMac = UA.indexOf('macintosh') !== -1
export const isWindows = UA.indexOf('windows') !== -1
export const isAndroid = UA.indexOf('android') !== -1
export const isIphone = UA.indexOf('iphone') !== -1
export const isIpad = UA.indexOf('ipad') !== -1
export const isIpod = UA.indexOf('ipod') !== -1
export const isIOS = isIphone || isIpad || isIpod
export const isDesktop = isMac || isWindows

export function delay(time: number): Promise<undefined> {
  return new Promise((resolve, reject) => {
    window.setTimeout(resolve, time)
  })
}

const headElement = document.head || document.getElementsByTagName('head')[0]
const _importedScript: { [src: string]: true } = {}
/**
 * load dependency by script tag
 */
export function importScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (src in _importedScript) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onerror = err => {
      headElement.removeChild(script)
      reject(new URIError(`The Script ${src} is no accessible.`))
    }
    script.onload = () => {
      _importedScript[src] = true
      resolve()
    }
    headElement.appendChild(script)
    script.src = src
  })
}

export function override<T extends Function>(name: string, callback: T) {
  return function(this: { props: object }, ...args: any[]) {
    callback(...args)
    if (typeof this.props[name] === 'function') {
      this.props[name](...args)
    }
  }
}

export function hasEquals(a: any) {
  return isObject(a) && 'equals' in a && typeof a.equals === 'function'
}

export function settableEquals(val1: any, val2: any) {
  return isEqualWith(val1, val2, (a, b) => {
    // 利用BMap自身的equals方法
    if (hasEquals(a)) {
      return a.equals(b)
    } else if (hasEquals(b)) {
      return b.equals(a)
    }
  })
}

export function initializeSettableProperties(properties: string[], instance: object, props: object) {
  properties.forEach(property => {
    const value = props[property]
    if (value != null) {
      const methodName = `set${upperFirst(property)}`
      if (typeof instance[methodName] === 'function') {
        instance[methodName](value)
      }
    }
  })
}

export function initializeEnableableProperties(properties: string[], instance: object, props: object) {
  properties.forEach(property => {
    const upperName = upperFirst(property)
    const propsName = `enable${upperName}`
    if (props[propsName] != null) {
      const methodName = props[propsName] ? propsName : `disable${upperName}`
      if (typeof instance[methodName] === 'function') {
        instance[methodName]()
      }
    }
  })
}

/**
 * 转换foo_bar 为 onfoobar
 */
export const getBDEventHandleName = memoize((event: string) => {
  return `on${event.split('_').join('')}`
})

const abbrMap = {
  dbl: 'double',
}

/**
 * 转换foo_bar 为 FooBar, 并将转换一些简写，如dbl -> double
 */
export const getPropsEventHandleName = memoize((event: string) => {
  return event
    .split('_')
    .map(word => upperFirst(word in abbrMap ? abbrMap[word] : word))
    .join('')
})

export function initializeEvents(events: string[], instance: object, props: object, context?: object) {
  events.forEach(event => {
    const eventName = getBDEventHandleName(event)
    const normalizeEventName = getPropsEventHandleName(event)
    const propsName = `on${normalizeEventName}`
    const overrideMethod = `handle${normalizeEventName}`

    // 覆盖监听器
    if (context && typeof context[overrideMethod] === 'function') {
      instance[eventName] = (context[overrideMethod] as Function).bind(context)
      return
    }

    if (typeof props[propsName] === 'function') {
      instance[eventName] = props[propsName]
    }
  })
}

export function updateSettableProperties(properties: string[], instance: object, props: object, prevProps: object) {
  properties.forEach(property => {
    // 尝试使用Baidu对象自带的equals进行比较
    const currentValue = props[property]
    const prevValue = prevProps[property]
    if (!settableEquals(currentValue, prevValue)) {
      const value = props[property]
      const methodName = `set${upperFirst(property)}`
      if (typeof instance[methodName] === 'function') {
        instance[methodName](value)
      }
    }
  })
}

export function updateEnableableProperties(properties: string[], instance: object, props: object, prevProps: object) {
  properties.forEach(property => {
    const upperName = upperFirst(property)
    const propsName = `enable${upperName}`
    if (props[propsName] !== prevProps[propsName]) {
      if (props[propsName] != null) {
        const methodName = props[propsName] ? propsName : `disable${upperName}`
        if (typeof instance[methodName] === 'function') {
          instance[methodName]()
        }
      }
    }
  })
}

export function updateEvents(events: string[], instance: object, props: object, prevProps: object, context?: object) {
  events.forEach(event => {
    const eventName = getBDEventHandleName(event)
    const normalizeEventName = getPropsEventHandleName(event)
    const propsName = `on${normalizeEventName}`
    const overrideMethod = `handle${normalizeEventName}`

    if (context && overrideMethod in context) {
      return
    }

    if (props[propsName] !== prevProps[propsName]) {
      instance[eventName] = props[propsName]
    }
  })
}

import upperFirst from 'lodash/upperFirst'

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
  return typeof a === 'object' && 'equals' in a
}

export function baiduEquals(a: any, b: any) {
  if (a == null && b == null) {
    return true
  }

  if (hasEquals(a)) {
    return a.equals(b)
  } else if (hasEquals(b)) {
    return b.equals(a)
  }

  return a === b
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

export function initializeEvents(events: string[], instance: object, props: object, context?: object) {
  events.forEach(event => {
    const eventName = `on${event}`
    const propsName = `on${upperFirst(event)}`
    const overrideMethod = `handle${upperFirst(event)}`
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
    if (!baiduEquals(currentValue, prevValue)) {
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
    const eventName = `on${event}`
    const propsName = `on${upperFirst(event)}`
    const overrideMethod = `handle${upperFirst(event)}`

    if (context && overrideMethod in context) {
      return
    }

    if (props[propsName] !== prevProps[propsName]) {
      instance[eventName] = props[propsName]
    }
  })
}

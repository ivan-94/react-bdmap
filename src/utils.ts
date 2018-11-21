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

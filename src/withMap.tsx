import React from 'react'
import { BDMapContext } from './BDMap'

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export interface WithMapInjectedProps {
  map: BMap.Map
}

/**
 * **withMap**是一个高阶组件，用于将当前上下文的`BMap.Map`实例注入到目标组件中。用于实现对地图组件的自定义控制.
 */
export default function withMap<T = any, P extends WithMapInjectedProps = WithMapInjectedProps>(
  Comp: React.ComponentClass<P>,
) {
  type Props = Omit<P, keyof WithMapInjectedProps>

  return React.forwardRef<T, Props>((props, ref?: React.Ref<any>) => {
    return (
      <BDMapContext.Consumer>
        {value => {
          // @ts-ignore
          return <Comp {...props} ref={ref} map={value.nativeInstance} />
        }}
      </BDMapContext.Consumer>
    )
  })
}

import React from 'react'
import BDMapLoader from '../BDMapLoader'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import * as utils from '../utils'

jest.mock('../utils', () => {
  return {
    delay: jest.fn().mockResolvedValue(undefined),
    importScript: jest.fn().mockResolvedValue(undefined),
  }
})

test('throw error when apiKey not present', () => {
  const render = () => {
    // @ts-ignore
    shallow(<BDMapLoader />)
  }
  expect(render).toThrow()
})

describe('BMap loading', () => {
  beforeEach(() => {
    // @ts-ignore
    window.BMap = undefined
    window.loadBDMap = undefined
    ;(utils.importScript as jest.Mock).mockResolvedValue(undefined)
    jest.clearAllMocks()
  })

  it('should render loading fallback', () => {
    const comp = shallow(<BDMapLoader apiKey="test" fallback={() => <div>loading</div>} />)
    expect(comp.containsMatchingElement(<div>loading</div>)).toBeTruthy()
  })

  it('should call importScript', () => {
    shallow(<BDMapLoader apiKey="test" />)
    expect(utils.importScript).toBeCalled()
    expect(typeof window.loadBDMap).toBe('function')
  })

  it('should render children after importScript resolved', () => {
    const promise = BDMapLoader.ready()
    const comp = shallow(
      <BDMapLoader apiKey="test">
        <div>loaded</div>
      </BDMapLoader>,
    )

    // @ts-ignore
    window.loadBDMap()
    expect(comp.state('loaded')).toBeTruthy()
    expect(comp.contains(<div>loaded</div>)).toBeTruthy()
    return expect(promise).resolves.toBe(undefined)
  })

  it('should fallback to error after importScript reject', done => {
    ;(utils.importScript as jest.Mock).mockRejectedValue(new Error('test'))
    const catchFn = jest.fn()
    BDMapLoader.ready().catch(catchFn)
    const comp = shallow(
      <BDMapLoader apiKey="test" fallback={err => (err ? <div>error</div> : <div>loading</div>)}>
        <div>loaded</div>
      </BDMapLoader>,
    )

    setTimeout(() => {
      expect(comp.state('error')).toBeDefined()
      expect(comp.contains(<div>error</div>)).toBeTruthy()
      expect(catchFn).toBeCalled()
      done()
    }, 0)
  })
})

describe('BMap loaded', () => {
  beforeAll(() => {
    // @ts-ignore
    window.BMap = {}
  })

  afterAll(() => {
    // @ts-ignore
    window.BMap = undefined
  })

  it('should match snapshot', () => {
    const comp = renderer
      .create(
        <BDMapLoader apiKey="test">
          <div>map</div>
        </BDMapLoader>,
      )
      .toJSON()
    expect(comp).toMatchSnapshot()
  })

  test('render children when BMap loaded', () => {
    const component = shallow(
      <BDMapLoader apiKey="test">
        <div>map</div>
      </BDMapLoader>,
    )
    expect(component.containsMatchingElement(<div>map</div>)).toBeTruthy()
  })
})

import React from 'react'
import BDMapLoader from '../BDMapLoader'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

test('throw error when apiKey not present', () => {
  const render = () => {
    // @ts-ignore
    shallow(<BDMapLoader />)
  }
  expect(render).toThrow()
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

import React from 'react'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import ConversionResult from '../components/conversionResult'

configure({adapter: new Adapter()});
const each  = require("jest-each").default;

describe('conversionResult', () => {
  each([
    ['100', null],
    [null, '$'],
    [null, null]
  ]).it('renders no result', (amount, targetCur) => {
    // when
    const component = shallow(
      <ConversionResult result={amount} targetCurrency={targetCur}/>
    )

    //then
    expect(component.getElements()).toMatchSnapshot();
  })

  it('renders conversion result', () => {
    // when
    const component = shallow(
      <ConversionResult result = '100' targetCurrency='$' />
    )

    //then
    expect(component.getElements()).toMatchSnapshot();
  })
})

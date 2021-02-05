import React from 'react'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import CurrencyOption from '../components/currencyOption'
import constants from '../data/constants'

configure({adapter: new Adapter()});

describe('CurrencyOption', () => {
  it('should render currency option', () => {
    // when
    const component = shallow(
      <CurrencyOption
        label='some label'
        value='100'
        options={['opt1', 'opt2']}
      />
      )

    //then
    expect(component.getElements()).toMatchSnapshot();
  })
})


//<label htmlFor={props.label.split(' ').join('-')}>{props.label}:</label>
//       <select onChange={props.onChange} value={props.value}>
//         { props.options.map(opt => <option>{opt}</option>) }
//       </select>
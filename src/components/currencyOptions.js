import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  selectCurrencyBase, selectCurrencyTarget, resetCurrencyTarget
} from '../actions/currenciesAction'
import CurrencyOption from './currencyOption'
import constants from '../data/constants'

class CurrencyOptions extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      currencySelectedBase: constants.defaultOption,
    }

    this.handleOptionChangeCurBase = this.handleOptionChangeCurBase.bind(this)
    this.handleOptionChangeCurTarget = this.handleOptionChangeCurTarget.bind(this)
  }

  handleOptionChangeCurBase(e) {
    // TODO: consider to keep history of requests to prevent duplicate API calls.
    //  But still make a call if date has been changed as rates are changing on a daily basis

    const selectedVal = e.target.value
    this.props.selectCurrencyBase(selectedVal)

    // // TODO: this block is not executed properly as the fetchRates is asynchronous
    // if (this.props.ratesError == null) {
    //   this.setState( {currencySelectedBase: selectedVal})
    // } else {
    //   this.setState( {currencySelectedBase: this.initialOption})
    //   alert(`Error occurred: ${this.props.ratesError}`)
    // }
  }

  handleOptionChangeCurTarget(e) {
    const selectedVal = e.target.value
    if (this.props.optionCurrencyBase === constants.defaultOption) {
      alert('Select base currency first')
    } else if (!(selectedVal in this.props.rates)) {
      alert(
        'Selected currency is not supported. Supported values: ' +
        `${Object.keys(this.props.rates)}`
      )
      this.props.resetCurrencyTarget()
    } else this.props.selectCurrencyTarget(selectedVal)
  }

  render () {
    const options = Object.keys(this.props.currencies.items).map(currency => currency)

    return (
      <div>
        <CurrencyOption
          value={this.props.optionCurrencyBase}
          label='base currency'
          onChange={this.handleOptionChangeCurBase}
          options={[constants.defaultOption].concat(options)}
        />
        <CurrencyOption
          value={this.props.optionCurrencyTarget}
          label='target currency'
          onChange={this.handleOptionChangeCurTarget}
          options={[constants.defaultOption].concat(options)}
        />
      </div>
    )
  }
}

CurrencyOptions.propTypes = {
  fetchRates: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  // ... computed data from state and optionally ownProps
  // called every time the store state changes. It receives the entire store state,
  // and should return an object of data this component needs
  currencies: state.currencies,
  rates: state.rates.items,
  ratesError: state.rates.error,
  optionCurrencyBase: state.currencyOption.base,
  optionCurrencyTarget: state.currencyOption.target
});

const mapDispatchToProps = {
  // ... normally is an object full of action creators. But can be a function
  // each action creator will be turned into a prop function
  // that automatically dispatches its action when called
  selectCurrencyBase,
  selectCurrencyTarget,
  resetCurrencyTarget
}

// `connect` returns a new function that accepts the component to wrap:
// and the final function returns the connected, wrapper component
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrencyOptions)
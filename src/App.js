import './App.css';
import React from 'react'

import PropTypes from 'prop-types'  // Runtime type checking for React props and similar objects.
import { connect } from 'react-redux'

import CurrencyOptions from './components/currencyOptions'
import ConversionResult from './components/conversionResult'
import { fetchCurrencies } from './actions/currenciesAction'

import constants from './data/constants'

class App extends React.Component {
  constructor (props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this)

    this.state = { amount: 0 }
  }

  componentDidMount() {
    this.props.fetchCurrencies();
  }

  handleInputChange(e) {
    const reNumbers = /^[0-9]+$/
    if (e.target.value === ''  || reNumbers.test(e.target.value)) {
      this.setState( {amount: e.target.value} )
    }
  }

  render() {
    let currencyBlock
    if (this.props.currenciesError) {
      currencyBlock = (
        <div>
          <h3>Currencies are not available. Error occurred: "{this.props.currenciesError}"</h3>
        </div>
      )
    } else if (this.props.currencies) {
      const amountFloat = parseFloat(this.state.amount)

      let conversionResult
      if (
        amountFloat && amountFloat > 0 &&
        this.props.currencySelectedTarget &&
        this.props.rates // probably this check is redundant
      ) {
        const rate = this.props.rates[this.props.currencySelectedTarget]
        conversionResult = amountFloat * rate
      } else conversionResult = null

      currencyBlock = (
        <div>
          <CurrencyOptions/>
          <ConversionResult
            result={conversionResult}
            targetCurrency={this.props.currencySelectedTarget}
          />
        </div>
      )
    } else {
      // this happens before the data fetched and no errors nor data available
      // currencyBlock = null
    }

    let currencyChar
    if (this.props.optionCurrencyBase !== constants.defaultOption) {
      currencyChar = this.props.currencies[this.props.optionCurrencyBase].symbol
    }

    return (
      <div className="App">
        <h1>Currency Converter</h1>
        <form>
          <input
            type='text'
            placeholder='amount'
            value = {this.state.amount ? this.state.amount : ''}
            onChange={this.handleInputChange}
          />
          <label>{currencyChar}</label>
          { currencyBlock }
        </form>
      </div>
    );
  }
}

App.propTypes = {
  fetchCurrencies: PropTypes.func.isRequired,
}

const mapStateToProps = state => {
  return {
    currencies: state.currencies.items,
    currenciesError: state.currencies.error,
    rates: state.rates.items,
    optionCurrencyBase: state.currencyOption.base,
    currencySelectedTarget: state.currencyOption.target
  }
};

export default connect(
  mapStateToProps,
  { fetchCurrencies }
  )(App)

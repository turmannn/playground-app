import './App.css';
import React from 'react'

import PropTypes from 'prop-types'  // Runtime type checking for React props and similar objects.
import { connect } from 'react-redux'

import { fetchCurrencies } from './actions/currenciesAction'

function CurrencyOptions(props) {
  console.log('CurrencyOptions')
  return (
    <div>
      <label htmlFor={props.label.split(' ').join('-')}>{props.label}:</label>
      <select id={props.id} onChange={props.onChange} value={props.value}>
        { ['select'].concat(props.availableOpts).map(opt => <option>{opt}</option>) }
      </select>
    </div>
  )
}

function ConversionResult(props) {
  const result = props.result && props.targetCurrency
    ? `${props.result} ${props.targetCurrency}`
    : ''

  return (
    <h3>conversion result: { result }</h3>
  )
}

class App extends React.Component {
  constructor (props) {
    super(props);
    this.handleOptionChangeCurBase = this.handleOptionChangeCurBase.bind(this)
    this.handleOptionChangeCurTarget = this.handleOptionChangeCurTarget.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)

    this.state = {
      // errorCurrencies: null,
      errorRates: null,
      currencySelectedBase: 'select',
      currencySelectedTarget: 'select',
      // currencies: null,
      rates: null,
      amount: 0
    }
  }

  componentDidMount() {
    this.props.fetchCurrencies();
  }

  handleOptionChangeCurBase(e) {
    // TODO: consider to keep history of requests to prevent duplicate API calls.
    //  But still make a call if date has been changed ass rates are changing on a daily basis

    const selectedVal = e.target.value
    const currencyRatesEndpoint = `https://api.exchangeratesapi.io/latest?base=${selectedVal}`

    fetch(currencyRatesEndpoint)
      .then(res => res.json())
      .then(
        result => {
          if (result.rates) {
            this.setState({
              rates: result.rates,
              currencySelectedBase: selectedVal
            })
          } else {
            if (result.error) {
              if (result.error.includes('not supported')) {
                alert(`Selected base currency ${selectedVal} is not supported`)
              } else this.setState({errorRates: result.error.toString()})
            }
            this.setState({ currencySelectedBase: 'select' })
          }
        },
        error => this.setState({errorRates: error.toString()}) //TODO: handle case when selected currency is not supported
      )
  }

  handleOptionChangeCurTarget(e) {
    const selectedVal = e.target.value
    if (!(selectedVal in this.state.rates)) {
      alert(
        'Selected currency is not supported. Supported values: ' +
        `${Object.keys(this.state.rates)}`
      )
      this.setState( {currencySelectedTarget: 'select'})
    } else this.setState({ currencySelectedTarget: selectedVal })
  }

  handleInputChange(e) {
    const reNumbers = /^[0-9]+$/
    console.log(reNumbers.test(e.target.value))
    if (e.target.value === ''  || reNumbers.test(e.target.value)) {
      this.setState( {amount: e.target.value} )
    }

  }

  render() {
    let currencyBlock
    // if (this.state.errorCurrencies) {
    if (this.props.currenciesFetchError) {
      currencyBlock = (
        <div>
          <h3>Error happened: {this.state.error}</h3>
        </div>
      )
    // } else if (this.state.currencies) {
    } else if (this.props.currencies) {
      const options = Object.keys(this.props.currencies).map(currency => currency)
      const amountFloat = parseFloat(this.state.amount)

      let conversionResult
      if (
        amountFloat && amountFloat > 0 &&
        this.state.currencySelectedTarget &&
        this.state.rates
      ) {
        const rate = this.state.rates[this.state.currencySelectedTarget]
        conversionResult = amountFloat * rate
      } else conversionResult = null

      currencyBlock = (
        <div>
          <CurrencyOptions
            availableOpts={options} label={'base currency'}
            value={this.state.currencySelectedBase}
            onChange={this.handleOptionChangeCurBase}
          />
          <CurrencyOptions
            availableOpts={options} label={'target currency'}
            value={this.state.currencySelectedTarget}
            onChange={this.handleOptionChangeCurTarget}
          />
          <ConversionResult
            result={conversionResult}
            targetCurrency={this.state.currencySelectedTarget}
          />
        </div>
      )
    } else {
      // this happens before the data fetched and no errors nor data available
      currencyBlock = null
    }

    let currencyChar
    if (this.state.currencies && this.state.currencySelectedBase !== 'select') {
      currencyChar = this.state.currencies[this.state.currencySelectedBase].symbol
    }

    return (
      <div className="App">
        <h1>Currrency Converter</h1>
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

const mapStateToProps = state => ({
  currencies: state.currencies.items,
  currenciesFetchError: state.currencies.error
});

export default connect(mapStateToProps, { fetchCurrencies })(App)

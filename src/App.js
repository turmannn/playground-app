import logo from './logo.svg';
import './App.css';
import React from 'react'

class CurrencyOptions extends React.Component {
  render() {
    return (
      <div>
        <label htmlFor={this.props.label.split(' ').join('-')}>{this.props.label}:</label>
        <select id={this.props.id} onChange={this.props.onChange}>
          { this.props.availableOpts.map(opt => <option>{opt}</option>) }
        </select>
      </div>
    )
  }
}

class ConversionResult extends React.Component {
  render () {
    const result = this.props.result && this.props.targetCurrency ? `${this.props.result} ${this.props.targetCurrency}` : ''

    return (
      <h3>conversion result: { result }</h3>
    )
  }
}


class App extends React.Component {
  constructor (props) {
    super(props);
    this.handleOptionChangeCurBase = this.handleOptionChangeCurBase.bind(this)
    this.handleOptionChangeCurTarget = this.handleOptionChangeCurTarget.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)

    this.state = {
      errorCurrencies: null,
      errorRates: null,
      currencySelectedBase: null,
      currencySelectedTarget: null,
      currencies: null,
      rates: null,
      amount: 0
    }

  }

  componentDidMount() {
    const currenciesEndpoint = 'https://gist.githubusercontent.com/mddenton/062fa4caf150bdf845994fc7a3533f74/raw/27beff3509eff0d2690e593336179d4ccda530c2/Common-Currency.json'
    fetch(currenciesEndpoint)
      .then(res => res.json())
      .then(
        result => this.setState({ currencies: result }),
        error => this.setState({errorCurrencies: error.toString()})
      )
  }

  handleOptionChangeCurTarget(e) {
    console.log('Target selected')
    this.setState({currencySelectedTarget: e.target.value})
  }

  handleOptionChangeCurBase(e) {
    // TODO: consider to keep history of requests to prevent duplicate API calls. But still make a call if date has been changed ass rates are changing on a dily basis
    console.log('Base selected')
    const targetCur = e.target.value
    const currencyRatesEndpoint = `https://api.exchangeratesapi.io/latest?base=${targetCur}`

    fetch(currencyRatesEndpoint)
      .then(res => res.json())
      .then(
        result => this.setState({ rates: result.rates, currencySelectedBase: targetCur }),
        error => this.setState({errorRates: error.toString()}) //TODO: handle case when selected currency is not supported
      )
  }

  handleInputChange(e) {
    this.setState( {amount: e.target.value} )
  }

  render() {
    let currencyBlock

    if (this.state.errorCurrencies) {
      currencyBlock =
        <div>
          <h3>Error happened: {this.state.error}</h3>
        </div>
    } else if (this.state.currencies) {
      const options = Object.keys(this.state.currencies).map(currency => currency)

      const conversionResult = this.state.rates
        ? parseFloat(this.state.amount) * this.state.rates[this.state.currencySelectedTarget]
        : null

      currencyBlock =
        <div>
          <CurrencyOptions
            availableOpts={options} label={'base currency'}
            onChange={this.handleOptionChangeCurBase}
          />
          <CurrencyOptions
            availableOpts={options} label={'target currency'}
            onChange={this.handleOptionChangeCurTarget}
          />
          <ConversionResult
            result={conversionResult}
            targetCurrency={this.state.currencySelectedTarget}
          />
        </div>
    } else {
      // this happens before the data fetched and no errors nor data available
      currencyBlock = null
    }

    return (
      <div className="App">
        <h1>Currrency Converter</h1>
        <form>
          <input
            type='text'
            placeholder='amount'
            onChange={this.handleInputChange}
          />
        </form>

        { currencyBlock }
      </div>
    );
  }
}

export default App;

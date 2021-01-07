import logo from './logo.svg';
import './App.css';
import React from 'react'

class CurrencyOptions extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      error: null,
      currencySelectedBase: null,
      currencySelectedTarget: null,
      currencyData: {}
    }
  }

  render() {
    return (
      <div>
        <label htmlFor={this.props.label.split().join('-')}>{this.props.label}:</label>
        <select id={this.props.id} onChange={this.props.onChange}>
          { this.props.availableOpts.map(opt => <option>{opt}</option>) }
        </select>
      </div>
    )
  }
}

class ConversionResult extends React.Component {
  render () {
    return (
      <h1>conversion result: { this.props.conversionResult }</h1>
    )
  }
}


class App extends React.Component {
  constructor (props) {
    super(props);
    this.handleOptionChange = this.handleOptionChangeCurBase.bind(this)
    this.handleOptionChange = this.handleOptionChangeCurTarget.bind(this)
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

    if (this.state.currencySelectedTarget) {
      // currency is not selected after the first rendering happens
      // TODO: consider to keep history of requests to prevent duplicate API calls. But still make a call if date has been changed ass rates are changing on a dily basis

      const currencyRatesEndpoint = `https://api.exchangeratesapi.io/latest?base=${this.state.currencySelectedTarget}`

      fetch(currencyRatesEndpoint)
        .then(res => res.json())
        .then(
          result => this.setState({ rates: result }),
          error => this.setState({errorRates: error.toString()})
        )
    }
  }



  handleOptionChangeCurBase(e) {
    this.setState({currencySelectedBase: e.target.value})
  }

  handleOptionChangeCurTarget(e) {
    this.setState({currencySelectedTarget: e.target.value})
  }

  handleInputChange(e) {
    this.setState( {amount: e.target.value} )
  }

  render() {
    console.log('sel cur: ', this.state.currencySelected)
    let currencyBlock
    if (this.state.error) {
      currencyBlock =
        <div>
          <h3>Error happened: {this.state.error}</h3>
        </div>
    } else if (this.state.currencyData) {
      const options = Object.keys(this.state.currencyData).map(currency => currency)
      const conversionResult = this.state.amount * this.state.rates.rates[this.state.currencySelectedTarget]

      currencyBlock =
        <div>
          <CurrencyOptions availableOpts={options} label={'base currency'} onChange={this.handleOptionChangeCurBase} />
          <CurrencyOptions availableOpts={options} label={'target currency'} onChange={this.handleOptionChangeCurTarget} />
          <ConversionResult selectedCur={conversionResult}/>
        </div>
    } else {
      // this happens before the data fetched and no errors nor data available
      return null
    }

    return (
      <div className="App">
        <h3>Hello World</h3>
        <form>
          <input type='text' placeholder='amount' onChange={this.handleInputChange} />
        </form>

        { currencyBlock }
      </div>
    );
  }
}

export default App;

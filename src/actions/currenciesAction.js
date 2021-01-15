import {
  FETCH_CURRENCIES, FETCH_CURRENCIES_ERROR, SAVE_RATES, RATES_ERROR,
  SELECT_BASE_CURRENCY, RESET_BASE_CURRENCY, SELECT_TARGET_CURRENCY,
  RESET_TARGET_CURRENCY
} from './types'

export const fetchCurrencies = () => dispatch  => {
  const currenciesEndpoint = 'https://gist.githubusercontent.com/mddenton/062fa4caf150bdf845994fc7a3533f74/raw/27beff3509eff0d2690e593336179d4ccda530c2/Common-Currency.json'
  fetch(currenciesEndpoint)
    .then(res => res.json())
    .then(
      data => {
        return dispatch({ type: FETCH_CURRENCIES, payload: data })
      },
      error => dispatch({type: FETCH_CURRENCIES_ERROR, payload: error.toString()})
    )
}

export const selectCurrencyBase = (selectedVal) => dispatch => {
  const currencyRatesEndpoint =
    `https://api.exchangeratesapi.io/latest?base=${selectedVal}`

  fetch(currencyRatesEndpoint)
    .then(res => res.json())
    .then(
      data => {
        if (data.rates) {
          return [
            dispatch( {type: SELECT_BASE_CURRENCY, payload: selectedVal}),
            dispatch( {type: SAVE_RATES, payload: data.rates} )
          ]
        } else {
          // TODO: figure out whether the alert can be moved into the componentDidMount component after the fetchRates() call
          if (data.error && data.error.includes('not supported')) {
            alert(`Selected base currency ${selectedVal} is not supported`)
          }
          return [
            dispatch( {type: RESET_BASE_CURRENCY}),
            dispatch( {type: RATES_ERROR, payload: data.error.toString()} )
          ]
        }
      },
      error => [
        dispatch( {type: RESET_BASE_CURRENCY}),
        dispatch({ type: RATES_ERROR, payload: error.toString() })
        ]
    )
}

export const selectCurrencyTarget = (selectedVal) => {
  return {
    type: SELECT_TARGET_CURRENCY,
    payload: selectedVal
  }
}

export const resetCurrencyTarget = () => {
  return {type: RESET_TARGET_CURRENCY }
}

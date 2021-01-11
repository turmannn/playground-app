import { FETCH_CURRENCIES, FETCH_CURRENCIES_ERROR }  from './types'

export const fetchCurrencies = () => dispatch  => {
  console.log('Action creator: about to fetch')
  const currenciesEndpoint = 'https://gist.githubusercontent.com/mddenton/062fa4caf150bdf845994fc7a3533f74/raw/27beff3509eff0d2690e593336179d4ccda530c2/Common-Currency.json'
  fetch(currenciesEndpoint)
    .then(res => res.json())
    .then(
      data => dispatch({ type: FETCH_CURRENCIES, payload: data }),   // currencies: result }),
      error => dispatch({type: FETCH_CURRENCIES_ERROR, payload: error.toString()})
    )
}
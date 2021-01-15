import { combineReducers } from 'redux'
import { currenciesReducer, ratesReducer, currencyOptionReducer }  from './currenciesReducer'

const rootReducer = combineReducers({
  currencies: currenciesReducer,
  rates: ratesReducer,
  currencyOption: currencyOptionReducer
})

export default rootReducer

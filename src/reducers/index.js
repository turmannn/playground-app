import { combineReducers } from 'redux'
import currenciesReducer from './currenciesReducer'

const rootReducer = combineReducers({
  currencies: currenciesReducer
})

export default rootReducer

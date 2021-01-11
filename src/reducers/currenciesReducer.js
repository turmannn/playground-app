import { FETCH_CURRENCIES, FETCH_CURRENCIES_ERROR } from '../actions/types'

const initialState = {
  currency: {}
}

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_CURRENCIES_ERROR:
      return {
        ...state,
        error: action.payload
      }
    case FETCH_CURRENCIES:
      return {
        ...state,
        items: action.payload
      }
    default:
      return state;
  }
}
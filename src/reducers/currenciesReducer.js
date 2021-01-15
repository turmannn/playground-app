import {
  FETCH_CURRENCIES, FETCH_CURRENCIES_ERROR, SAVE_RATES, RATES_ERROR,
  SELECT_BASE_CURRENCY, RESET_BASE_CURRENCY, SELECT_TARGET_CURRENCY,
  RESET_TARGET_CURRENCY
} from '../actions/types'
import constants from '../data/constants'
import { act } from '@testing-library/react'

// TODO: figure out whether the initial state is modified by the reducer
const initialStateCurrencies = {
  items: {},
  error: null
}

export const currenciesReducer = function(state = initialStateCurrencies, action) {
  switch (action.type) {
    case FETCH_CURRENCIES:
      return {
        ...state,
        items: action.payload,
        error: null
      }
    case FETCH_CURRENCIES_ERROR:
      return {
        ...state,
        error: action.payload,
        items: {}
      }
    default:
      return state;
  }
}

const initialStateRates = {
  items: {},
  error: null
}

export const ratesReducer = function(state = initialStateRates, action) {
  switch (action.type) {
    case SAVE_RATES:
      return {
        ...state,
        items: action.payload,
        error: null
      }
    case RATES_ERROR:
      return {
        ...state,
        items: {},
        error: action.payload
      }
    default:
      return state;
  }
}

const initialStateOption = {
  base: constants.defaultOption,
  target: constants.defaultOption
}

export const currencyOptionReducer = function(state = initialStateOption, action) {
  switch (action.type) {
    case SELECT_BASE_CURRENCY:
      return {
        ...state,
        base: action.payload,
      }
    case RESET_BASE_CURRENCY:
      return {
        ...state,
        base: constants.defaultOption
      }
    case SELECT_TARGET_CURRENCY:
      return {
        ...state,
        target: action.payload
      }
    case RESET_TARGET_CURRENCY:
      return {
        ...state,
        target: constants.defaultOption
      }
    default:
      return state;
  }
}

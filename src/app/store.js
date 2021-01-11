import {configureStore} from '@reduxjs/toolkit'
import sideBarReducer from '../features/sideBarReducer'

export default configureStore({
  reducer: {
    features: sideBarReducer
  }
})
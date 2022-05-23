import React from 'react'
import { Provider } from 'react-redux'
import { store } from './redux/store'
const AppWrapper = ({ children }: any) => {
  return <Provider store={store}>{children}</Provider>
}

export default AppWrapper

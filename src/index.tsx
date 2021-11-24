import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import './styles/index.scss'

import axiosConfig from './utils/axios.config'
import { sagaMiddleware, store } from './store'
import saga from './saga'
import { App } from './App'

axiosConfig()
sagaMiddleware.run(saga)

render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('app')
)

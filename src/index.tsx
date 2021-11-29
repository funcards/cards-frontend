import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'

import './styles/index.scss'

import axiosConfig from './utils/axios.config'
import { sagaMiddleware, store } from './store'
import saga from './saga'
import { App } from './App'

axiosConfig()
sagaMiddleware.run(saga)

render(
  <Provider store={store}>
    <HelmetProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </HelmetProvider>
  </Provider>,
  document.getElementById('app')
)

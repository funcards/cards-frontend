import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'

import './styles/index.scss'

import { store } from './store'
import { App } from './App'

render(
  <Provider store={store}>
    <HelmetProvider>
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </HelmetProvider>
  </Provider>,
  document.getElementById('app')
)

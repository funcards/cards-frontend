import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { sagaMiddleware, store } from './store'
import rootSaga from './store/rootSaga'
import { App } from './App'

sagaMiddleware.run(rootSaga)

render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('app')
)

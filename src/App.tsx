import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { PageTitle } from './components/helmet/PageTitle'

export const App: React.FC = () => (
  <BrowserRouter>
    <PageTitle />
    <h1>Hello world!!!</h1>
  </BrowserRouter>
)

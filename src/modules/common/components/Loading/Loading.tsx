import React from 'react'

import { Loader } from '../Loader/Loader'

import * as classes from './Loading.module.scss'

export const Loading: React.FC = () => (
  <main className={classes.loading}>
    <Loader />
  </main>
)

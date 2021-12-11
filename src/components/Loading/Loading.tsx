import React from 'react'

import * as classes from './Loading.module.scss'

import { Loader } from '~src/components'

export const Loading: React.FC = () => (
  <main className={classes.loading}>
    <Loader />
  </main>
)

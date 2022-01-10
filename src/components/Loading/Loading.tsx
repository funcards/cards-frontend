import React from 'react'

import { Loader } from '~src/components'

import * as classes from './Loading.module.scss'

export const Loading: React.FC = () => (
  <main className={classes.loading}>
    <Loader />
  </main>
)

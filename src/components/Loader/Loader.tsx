import React from 'react'
import { TiPlus } from 'react-icons/ti'

import { Theme } from '~src/store/types'

import * as classes from './Loader.module.scss'

export interface LoaderProps {
  theme?: Theme
}

export const Loader: React.FC<LoaderProps> = ({ theme }) => (
  <div className={classes.loader} data-theme={theme || Theme.Sky}>
    <div className={classes.loader__xl} />
    <div className={classes.loader__lg} />
    <div className={classes.loader__md} />
    <div className={classes.loader__add}>
      <TiPlus className={classes.loader__icon} />
      &nbsp;
      <span>Add another list</span>
    </div>
    <span className={classes.loader__loading}>Loading...</span>
  </div>
)

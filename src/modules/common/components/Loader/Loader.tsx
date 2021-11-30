import React from 'react'

import * as classes from './Loader.module.scss'

import { Theme } from '~src/modules/common/common.types'

export interface LoaderProps {
  theme?: Theme
}

export const Loader: React.FC<LoaderProps> = ({ theme }) => (
  <div className={classes.loader} data-theme={theme || Theme.Sky}>
    <div className={classes.loader__xl} />
    <div className={classes.loader__lg} />
    <div className={classes.loader__md} />
    <div className={classes.loader__add}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={classes.loader__icon}
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      &nbsp;
      <span>Add another list</span>
    </div>
    <span className={classes.loader__loading}>Loading...</span>
  </div>
)

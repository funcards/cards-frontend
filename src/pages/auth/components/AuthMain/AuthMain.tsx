import React from 'react'

import * as classes from './AuthMain.module.scss'

export type AuthMainProps = {
  children: React.ReactNode
}

export const AuthMain: React.FC<AuthMainProps> = ({ children }) => (
  <main className={classes.authMain}>
    <div className={classes.authMain__container}>{children}</div>
  </main>
)

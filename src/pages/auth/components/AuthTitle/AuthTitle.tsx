import React from 'react'

import * as classes from './AuthTitle.module.scss'

export type AuthTitleProps = {
  title: string
}

export const AuthTitle: React.FC<AuthTitleProps> = ({ title }) => <h1 className={classes.authTitle}>{title}</h1>

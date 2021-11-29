import React from 'react'

import { AuthForm, AuthFormProps } from '../AuthForm/AuthForm'

import * as classes from './AuthPage.module.scss'

export interface AuthPageProps extends AuthFormProps {
  title: string
  footer: React.ReactElement
}

export const AuthPage: React.FC<AuthPageProps> = (props: AuthPageProps) => (
  <main className={classes.auth}>
    <div className={classes.auth__container}>
      <h1 className={classes.auth__title}>{props.title}</h1>
      <AuthForm
        className={classes.auth__form}
        loading={props.loading}
        btnLabel={props.btnLabel}
        onFormSubmit={props.onFormSubmit}
        formFields={props.formFields}
      />
      <div className={classes.auth__footer}>{props.footer}</div>
    </div>
  </main>
)

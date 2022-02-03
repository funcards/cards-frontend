import React, { useCallback, useMemo } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Button, Form, FormError, FormRow, PageTitle, TextField } from '@/components';
import { appLongName, routes } from '@/config';
import { email, password } from '@/validators';
import { SignIn } from '@/types';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { selectAuth, signIn } from '@/store';

import { AuthFooter, AuthMain, AuthTitle } from './components';

const schema = yup.object({ email, password }).required();

const SignInPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(selectAuth);

  const onSubmit = useCallback(
    (data) => {
      dispatch(signIn(data));
    },
    [dispatch]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<SignIn>({ mode: 'onChange', resolver: yupResolver(schema) });

  const disabled = useMemo(() => isLoading || !isDirty || !isValid, [isLoading, isDirty, isValid]);

  return (
    <AuthMain>
      <PageTitle title="Sign in" />
      <AuthTitle title={`Sign in to ${appLongName}`} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow>
          <TextField type="email" placeholder="Enter email" error={errors.email} {...register('email')} />
          <FormError error={errors.email} />
        </FormRow>
        <FormRow>
          <TextField type="password" placeholder="Enter password" error={errors.password} {...register('password')} />
          <FormError error={errors.password} />
        </FormRow>
        <FormRow>
          <Button type="submit" primary={true} disabled={disabled} spinner={isLoading}>
            Sign In
          </Button>
        </FormRow>
      </Form>
      <AuthFooter>
        <Link to={routes.auth.forgotPassword}>Can&apos;t log in?</Link>
        <Link to={routes.auth.signUp}>Sign up for an account</Link>
      </AuthFooter>
    </AuthMain>
  );
};

export default SignInPage;

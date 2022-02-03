import React, { useCallback, useMemo } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';

import { email, password } from '@/validators';
import { SignUp } from '@/types';
import { AuthFooter, AuthMain, AuthTitle } from '@/pages/auth/components';
import { Button, Form, FormError, FormRow, PageTitle, TextField } from '@/components';
import { routes } from '@/config';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { selectAuth, signUp } from '@/store';

const schema = yup
  .object({
    name: yup.string().required().min(2, 'Name is too short').max(100, 'Name is too long'),
    email,
    password,
  })
  .required();

const SignUpPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(selectAuth);

  const onSubmit = useCallback(
    (data) => {
      dispatch(signUp(data));
    },
    [dispatch]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<SignUp>({ mode: 'onChange', resolver: yupResolver(schema) });

  const disabled = useMemo(() => isLoading || !isDirty || !isValid, [isLoading, isDirty, isValid]);

  return (
    <AuthMain>
      <PageTitle title="Sign up" />
      <AuthTitle title="Sign up for your account" />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow>
          <TextField type="text" placeholder="Enter full name" error={errors.name} {...register('name')} />
          <FormError error={errors.name} />
        </FormRow>
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
            Sign Up
          </Button>
        </FormRow>
      </Form>
      <AuthFooter>
        <Link to={routes.auth.signIn}>Already have an account? Sign in</Link>
      </AuthFooter>
    </AuthMain>
  );
};

export default SignUpPage;

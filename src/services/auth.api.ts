import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh';

import { SignIn, SignUp, Tokens } from '@/types';

import { request } from '.';

const config: AxiosAuthRefreshRequestConfig = { skipAuthRefresh: true };

export class AuthApi {
  public static signIn(payload: SignIn): Promise<Tokens> {
    return request.post('/sign-in', payload, config).then(({ data }) => data);
  }

  public static signUp(payload: SignUp): Promise<Tokens> {
    return request.post('/sign-up', payload, config).then(({ data }) => data);
  }
}

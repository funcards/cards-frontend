import { User } from '@/types';

import { Api } from '.';

export class UsersApi {
  public static me(): Promise<User> {
    return Api.read('/users/me');
  }
}

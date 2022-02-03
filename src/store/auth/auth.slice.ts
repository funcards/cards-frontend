import { createAction, PayloadAction } from '@reduxjs/toolkit';
import { RequestStatusFlags } from '@reduxjs/toolkit/src/query/core/apiState';

import { CookiesStorage, LocalStorage } from '@/services';
import { SignIn, SignUp, Tokens, User } from '@/types';
import { createGenericSlice, flagsInitialState } from '@/store/createGeneric.slice';

export type AuthState = RequestStatusFlags & {
  isAuthenticated: boolean;
  tokens: Tokens | null;
  currentUser: User | null;
};

const keyTokens = 'tokens';
const keyCurrentUser = 'current.user';
const tokens = CookiesStorage.get<Tokens | null>(keyTokens, null);
const currentUser = LocalStorage.get<User | null>(keyCurrentUser, null);
const isAuthenticated = tokens !== null && currentUser !== null;

const initialState: AuthState = {
  isAuthenticated,
  tokens,
  currentUser,
  ...flagsInitialState,
};

const slice = createGenericSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state: AuthState, { payload }: PayloadAction<Tokens>) => {
      state.tokens = payload;
      CookiesStorage.set(keyTokens, payload);
    },
    setCurrentUser: (state: AuthState, { payload }: PayloadAction<User>) => {
      state.currentUser = payload;
      LocalStorage.set(keyCurrentUser, payload);
    },
    clear: () => {
      CookiesStorage.remove(keyTokens);
      LocalStorage.remove(keyCurrentUser);

      return { isAuthenticated: false, tokens: null, currentUser, ...flagsInitialState };
    },
  },
  fulfilled: (state) => ({ ...state, isAuthenticated: true }),
  rejected: (state) => ({ ...state, isAuthenticated: false }),
});

export default slice.reducer;

export const {
  pending: pendingAuth,
  fulfilled: fulfilledAuth,
  rejected: rejectedAuth,
  clear: clearAuth,
  setTokens,
  setCurrentUser,
} = slice.actions;

export const SIGN_IN = 'SIGN_IN';
export const SIGN_UP = 'SIGN_UP';
export const SIGN_OUT = 'SIGN_OUT';

export const signIn = createAction<SignIn>(SIGN_IN);
export const signUp = createAction<SignUp>(SIGN_UP);
export const signOut = createAction(SIGN_OUT);

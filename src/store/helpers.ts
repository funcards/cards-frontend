import { PayloadAction } from '@reduxjs/toolkit';

export const createPayload = <A>(payload: A): PayloadAction<A> => ({ payload } as PayloadAction<A>);

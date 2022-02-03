import { getRequestStatusFlags, QueryStatus, RequestStatusFlags } from '@reduxjs/toolkit/src/query/core/apiState';
import { createSlice, PayloadAction, SliceCaseReducers, ValidateSliceCaseReducers } from '@reduxjs/toolkit';

export const flagsInitialState = getRequestStatusFlags(QueryStatus.uninitialized);

export type CreateGenericSliceOptions<
  State extends RequestStatusFlags,
  CR extends SliceCaseReducers<State>,
  PT,
  FT,
  RT
> = {
  name: string;
  initialState: State;
  reducers: ValidateSliceCaseReducers<State, CR>;
  pending?: (state: State, payload: PT) => State;
  fulfilled?: (state: State, payload: FT) => State;
  rejected?: (state: State, payload: RT) => State;
};

export const createGenericSlice = <
  State extends RequestStatusFlags,
  CR extends SliceCaseReducers<State> = SliceCaseReducers<State>,
  PT = void,
  FT = void,
  RT = void
>({
  name,
  initialState,
  reducers,
  pending = (state) => state,
  fulfilled = (state) => state,
  rejected = (state) => state,
}: CreateGenericSliceOptions<State, CR, PT, FT, RT>) => {
  return createSlice({
    name,
    initialState,
    reducers: {
      pending: (state: State, { payload }: PayloadAction<PT>) => ({
        ...pending(state, payload),
        ...getRequestStatusFlags(QueryStatus.pending),
      }),
      fulfilled: (state: State, { payload }: PayloadAction<FT>) => ({
        ...fulfilled(state, payload),
        ...getRequestStatusFlags(QueryStatus.fulfilled),
      }),
      rejected: (state: State, { payload }: PayloadAction<RT>) => ({
        ...rejected(state, payload),
        ...getRequestStatusFlags(QueryStatus.rejected),
      }),
      clear: () => initialState,
      ...reducers,
    },
  });
};

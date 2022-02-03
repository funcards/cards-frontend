import axios from 'axios';
import { put } from 'redux-saga/effects';

import { ErrorResponse } from '@/types';
import { caught, success } from '@/store';

const toErrorResponse = (error: any): ErrorResponse => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response?.data as ErrorResponse;
  }

  return { status: 500, type: 'ClientError', title: 'Error', message: (error as Error).message };
};

export function* caughtWorker(e: any) {
  yield put(caught(toErrorResponse(e)));
}

export function* successWorker(message: string) {
  yield put(success(message));
}

import { all } from 'redux-saga/effects';

import { isProduction } from '@/config';
import { authWatcher } from '@/store/auth/auth.saga';
import { boardsWatcher } from '@/store/boards/boards.saga';
import { tagsWatcher } from '@/store/tags/tags.saga';
import { categoriesWatcher } from '@/store/categories/categories.saga';
import { cardsWatcher } from '@/store/cards/cards.saga';

export function* rootWatcher() {
  try {
    yield all([authWatcher(), boardsWatcher(), tagsWatcher(), categoriesWatcher(), cardsWatcher()]);
  } catch (e) {
    if (!isProduction) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }
}

import React from 'react';

import { Loader } from '..';

import styles from './Loading.module.scss';

export const Loading: React.FC = () => (
  <main className={styles.loading}>
    <Loader />
  </main>
);

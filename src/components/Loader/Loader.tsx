import React from 'react';
import { TiPlus } from 'react-icons/ti';

import { Theme } from '@/types';

import styles from './Loader.module.scss';

export interface LoaderProps {
  theme?: Theme;
}

export const Loader: React.FC<LoaderProps> = ({ theme }) => (
  <div className={styles.loader} data-theme={theme || Theme.Sky}>
    <div className={styles.loader__xl} />
    <div className={styles.loader__lg} />
    <div className={styles.loader__md} />
    <div className={styles.loader__add}>
      <TiPlus className={styles.loader__icon} />
      &nbsp;
      <span>Add another list</span>
    </div>
    <span className={styles.loader__loading}>Loading...</span>
  </div>
);

import React from 'react';

import styles from './AuthMain.module.scss';

export type AuthMainProps = {
  children: React.ReactNode;
};

export const AuthMain: React.FC<AuthMainProps> = ({ children }) => (
  <main className={styles.authMain}>
    <div className={styles.authMain__container}>{children}</div>
  </main>
);

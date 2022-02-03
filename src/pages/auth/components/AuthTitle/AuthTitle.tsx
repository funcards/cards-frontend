import React from 'react';

import styles from './AuthTitle.module.scss';

export type AuthTitleProps = {
  title: string;
};

export const AuthTitle: React.FC<AuthTitleProps> = ({ title }) => <h1 className={styles.authTitle}>{title}</h1>;

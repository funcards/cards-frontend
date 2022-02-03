import React from 'react';
import { TiTimes } from 'react-icons/ti';

import { Button } from '@/components';

import styles from './SwitchFormFooter.module.scss';

export type SwitchFormFooterProps = {
  isOpened: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  boardColor: string;
  label: string;
  onClose: () => void;
};

export const SwitchFormFooter: React.FC<SwitchFormFooterProps> = ({
  isOpened,
  isLoading,
  isDisabled,
  boardColor,
  label,
  onClose,
}) => (
  <div className={isOpened ? `${styles.switchFormFooter} ${styles.switchFormFooter_open}` : styles.switchFormFooter}>
    <Button
      primary={true}
      spinner={isLoading}
      className={styles.switchFormFooter__addBtn}
      disabled={isDisabled}
      data-theme={boardColor}
    >
      {label}
    </Button>
    <Button close={true} onClick={onClose}>
      <TiTimes />
    </Button>
  </div>
);

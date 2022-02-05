import React from 'react';
import { TiTimes } from 'react-icons/ti';

import { Button } from '@/components';
import { ChildrenProps } from '@/components/types';

import styles from './SwitchFormFooter.module.scss';

export type SwitchFormFooterProps = ChildrenProps & {
  isOpened: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  boardColor: string;
  label: string;
  onClose: () => void;
};

export const SwitchFormFooter: React.FC<SwitchFormFooterProps> = ({
  children,
  isOpened,
  isLoading,
  isDisabled,
  boardColor,
  label,
  onClose,
}) => (
  <div className={isOpened ? `${styles.switchFormFooter} ${styles.switchFormFooter_open}` : styles.switchFormFooter}>
    <Button
      type="submit"
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
    {children}
  </div>
);

import React from 'react'
import { TiTimes } from 'react-icons/ti'

import * as classes from './SwitchFormFooter.module.scss'

import { Button } from '~src/ui-kit'

export type SwitchFormFooterProps = {
  isOpened: boolean
  isLoading: boolean
  isDisabled: boolean
  boardColor: string
  label: string
  onClose: () => void
}

export const SwitchFormFooter: React.FC<SwitchFormFooterProps> = ({
  isOpened,
  isLoading,
  isDisabled,
  boardColor,
  label,
  onClose,
}) => (
  <div className={isOpened ? `${classes.switchFormFooter} ${classes.switchFormFooter_open}` : classes.switchFormFooter}>
    <Button
      primary={true}
      spinner={isLoading}
      className={classes.switchFormFooter__addBtn}
      disabled={isDisabled}
      data-theme={boardColor}
    >
      {label}
    </Button>
    <Button close={true} onClick={onClose}>
      <TiTimes />
    </Button>
  </div>
)

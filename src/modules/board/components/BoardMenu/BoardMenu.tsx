import React from 'react'
import { TiTimes, TiBook, TiBookmark, TiCogOutline, TiTags } from 'react-icons/ti'

import * as classes from './BoardMenu.module.scss'

export interface BoardMenuProps {
  boardColor: string
  isOpenMenu: boolean
  onCloseMenu: () => void
}

export const BoardMenu: React.FC<BoardMenuProps> = ({ boardColor, isOpenMenu, onCloseMenu }) => {
  const data = [
    { name: 'About this board', icon: <TiBook className={classes.boardMenu__icon} /> },
    { name: 'Change background', icon: <span className={classes.boardMenu__bg} data-theme={boardColor} /> },
    { name: 'Settings', icon: <TiCogOutline className={classes.boardMenu__icon} /> },
    { name: 'Labels', icon: <TiTags className={classes.boardMenu__icon} /> },
  ]

  return (
    <div className={isOpenMenu ? `${classes.boardMenu} ${classes.boardMenu_open}` : classes.boardMenu}>
      <div className={classes.boardMenu__header}>
        Menu
        <button
          onClick={onCloseMenu}
          className={
            isOpenMenu
              ? `${classes.boardMenu__closeBtn} ${classes.boardMenu__closeBtn_open}`
              : classes.boardMenu__closeBtn
          }
        >
          <TiTimes className={classes.boardMenu__icon} />
        </button>
      </div>
      <div className={classes.boardMenu__body}>
        <div className={classes.boardMenu__group}>
          {data.map(({ name, icon }, index) => (
            <button key={index} className={classes.boardMenu__item}>
              {icon}
              {name}
            </button>
          ))}
        </div>
        <div className={`${classes.boardMenu__group} ${classes.bmActivity}`}>
          <div className={classes.bmActivity__header}>
            <TiBookmark className={classes.bmActivity__icon} />
            <span className={classes.bmActivity__title}>Activity</span>
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { TiTimes, TiBook, TiBookmark, TiCogOutline, TiTags } from 'react-icons/ti'

import * as classes from './BoardMenu.module.scss'

export interface BoardMenuProps {
  boardColor: string
  menuIsOpened: boolean
  onCloseMenu: () => void
}

export const BoardMenu: React.FC<BoardMenuProps> = ({ boardColor, menuIsOpened, onCloseMenu }) => {
  const data = [
    { name: 'About this board', icon: <TiBook className={classes.boardMenu__icon} /> },
    { name: 'Change background', icon: <span className={classes.boardMenu__bg} data-theme={boardColor} /> },
    { name: 'Settings', icon: <TiCogOutline className={classes.boardMenu__icon} /> },
    { name: 'Labels', icon: <TiTags className={classes.boardMenu__icon} /> },
  ]

  return (
    <div className={menuIsOpened ? `${classes.boardMenu} ${classes.boardMenu_open}` : classes.boardMenu}>
      <div className={classes.boardMenu__header}>
        Menu
        <button
          onClick={onCloseMenu}
          className={
            menuIsOpened
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
        <div className={`${classes.activity} ${classes.boardMenu__group}`}>
          <div className={classes.activity__header}>
            <TiBookmark className={classes.activity__icon} />
            <span className={classes.activity__title}>Activity</span>
          </div>
        </div>
      </div>
    </div>
  )
}

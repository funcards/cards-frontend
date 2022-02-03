import React from 'react';
import { TiTimes, TiBook, TiBookmark, TiCogOutline, TiTags } from 'react-icons/ti';

import styles from './BoardMenu.module.scss';

export interface BoardMenuProps {
  boardColor: string;
  menuIsOpened: boolean;
  onCloseMenu: () => void;
}

export const BoardMenu: React.FC<BoardMenuProps> = ({ boardColor, menuIsOpened, onCloseMenu }) => {
  const data = [
    { name: 'About this board', icon: <TiBook className={styles.boardMenu__icon} /> },
    { name: 'Change background', icon: <span className={styles.boardMenu__bg} data-theme={boardColor} /> },
    { name: 'Settings', icon: <TiCogOutline className={styles.boardMenu__icon} /> },
    { name: 'Labels', icon: <TiTags className={styles.boardMenu__icon} /> },
  ];

  return (
    <div className={menuIsOpened ? `${styles.boardMenu} ${styles.boardMenu_open}` : styles.boardMenu}>
      <div className={styles.boardMenu__header}>
        Menu
        <button
          onClick={onCloseMenu}
          className={
            menuIsOpened
              ? `${styles.boardMenu__closeBtn} ${styles.boardMenu__closeBtn_open}`
              : styles.boardMenu__closeBtn
          }
        >
          <TiTimes className={styles.boardMenu__icon} />
        </button>
      </div>
      <div className={styles.boardMenu__body}>
        <div className={styles.boardMenu__group}>
          {data.map(({ name, icon }, index) => (
            <button key={index} className={styles.boardMenu__item}>
              {icon}
              {name}
            </button>
          ))}
        </div>
        <div className={`${styles.activity} ${styles.boardMenu__group}`}>
          <div className={styles.activity__header}>
            <TiBookmark className={styles.activity__icon} />
            <span className={styles.activity__title}>Activity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

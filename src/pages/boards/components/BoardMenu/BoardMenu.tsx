import React, { useCallback, useMemo, useReducer } from 'react';
import { TiChevronLeft, TiTimes, TiBook, TiBookmark, TiCogOutline, TiTags } from 'react-icons/ti';

import { buildClassName } from '@/components/helpers';
import { Board } from '@/types';

import { TagList } from '..';

import styles from './BoardMenu.module.scss';

enum MenuStatus {
  Root = 'Menu',
  AboutBoard = 'About this board',
  ChangeBackground = 'Change background',
  Settings = 'Settings',
  Labels = 'Labels',
  NewLabel = 'Create label',
}

type MenuState =
  | {
      status: MenuStatus.Root;
      isPrev: false;
      isRoot: true;
      isAboutBoard: false;
      isChangeBackground: false;
      isSettings: false;
      isLabels: false;
      isNewLabel: false;
    }
  | {
      status: MenuStatus.AboutBoard;
      isPrev: true;
      isRoot: false;
      isAboutBoard: true;
      isChangeBackground: false;
      isSettings: false;
      isLabels: false;
      isNewLabel: false;
    }
  | {
      status: MenuStatus.ChangeBackground;
      isPrev: true;
      isRoot: false;
      isAboutBoard: false;
      isChangeBackground: true;
      isSettings: false;
      isLabels: false;
      isNewLabel: false;
    }
  | {
      status: MenuStatus.Settings;
      isPrev: true;
      isRoot: false;
      isAboutBoard: false;
      isChangeBackground: false;
      isSettings: true;
      isLabels: false;
      isNewLabel: false;
    }
  | {
      status: MenuStatus.Labels;
      isPrev: true;
      isRoot: false;
      isAboutBoard: false;
      isChangeBackground: false;
      isSettings: false;
      isLabels: true;
      isNewLabel: false;
    }
  | {
      status: MenuStatus.NewLabel;
      isPrev: true;
      isRoot: false;
      isAboutBoard: false;
      isChangeBackground: false;
      isSettings: false;
      isLabels: false;
      isNewLabel: true;
    };

const MENU_PREV = 'PREV';

type MenuAction =
  | { type: 'PREV' }
  | { type: MenuStatus.Root }
  | { type: MenuStatus.AboutBoard }
  | { type: MenuStatus.ChangeBackground }
  | { type: MenuStatus.Settings }
  | { type: MenuStatus.Labels }
  | { type: MenuStatus.NewLabel };

const getMenuState = (status: MenuStatus): MenuState => {
  return {
    status,
    isPrev: status !== MenuStatus.Root,
    isRoot: status === MenuStatus.Root,
    isAboutBoard: status === MenuStatus.AboutBoard,
    isChangeBackground: status === MenuStatus.ChangeBackground,
    isSettings: status === MenuStatus.Settings,
    isLabels: status === MenuStatus.Labels,
    isNewLabel: status === MenuStatus.NewLabel,
  } as MenuState;
};

const initialMenuState = getMenuState(MenuStatus.Root);

const reducer = (state: MenuState, action: MenuAction): MenuState => {
  switch (action.type) {
    case MENU_PREV:
      if (state.status === MenuStatus.NewLabel) {
        return getMenuState(MenuStatus.Labels);
      }

      return getMenuState(MenuStatus.Root);
    default:
      return getMenuState(action.type);
  }
};

const data = [
  { name: MenuStatus.AboutBoard, icon: <TiBook /> },
  { name: MenuStatus.ChangeBackground, icon: <span className={styles.boardMenu__bg} /> },
  { name: MenuStatus.Settings, icon: <TiCogOutline /> },
  { name: MenuStatus.Labels, icon: <TiTags /> },
];

export interface BoardMenuProps {
  board: Board;
  menuIsOpened: boolean;
  onCloseMenu: () => void;
}

export const BoardMenu: React.FC<BoardMenuProps> = ({ board, menuIsOpened, onCloseMenu }) => {
  const [menuState, menuDispatch] = useReducer(reducer, initialMenuState);

  const prevClassName = useMemo(
    () =>
      buildClassName(
        styles.boardMenu__headerBtn,
        styles.boardMenu__headerBtn_left,
        menuIsOpened ? styles.boardMenu__headerBtn_open : ''
      ),
    [menuIsOpened]
  );

  const closeClassName = useMemo(
    () =>
      buildClassName(
        styles.boardMenu__headerBtn,
        styles.boardMenu__headerBtn_right,
        menuIsOpened ? styles.boardMenu__headerBtn_open : ''
      ),
    [menuIsOpened]
  );

  const onCLose = useCallback(() => {
    onCloseMenu();
    menuDispatch({ type: MenuStatus.Root });
  }, [onCloseMenu, menuDispatch]);

  const onPrev = useCallback(() => menuDispatch({ type: 'PREV' }), [menuDispatch]);

  const onSelect = useCallback((status: MenuStatus) => menuDispatch({ type: status }), [menuDispatch]);

  return (
    <div className={menuIsOpened ? `${styles.boardMenu} ${styles.boardMenu_open}` : styles.boardMenu}>
      <div className={styles.boardMenu__header}>
        {menuState.isPrev && (
          <button onClick={onPrev} className={prevClassName}>
            <TiChevronLeft />
          </button>
        )}
        {menuState.status}
        <button onClick={onCLose} className={closeClassName}>
          <TiTimes />
        </button>
      </div>
      <div className={styles.boardMenu__body}>
        <div className={styles.boardMenu__group} data-theme={board.color}>
          {menuState.isRoot &&
            data.map(({ name, icon }, index) => (
              <button type="button" key={index} className={styles.boardMenu__item} onClick={() => onSelect(name)}>
                {icon}
                {name}
              </button>
            ))}
          {menuState.isLabels && <TagList boardId={board.board_id} />}
        </div>
        <div className={`${styles.activity} ${styles.boardMenu__group}`}>
          <div className={styles.activity__header}>
            <TiBookmark />
            <h5>Activity</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useCallback, useEffect, useReducer } from 'react';
import { RiArrowLeftSLine, RiCloseLine } from 'react-icons/ri';

import { Tag } from '@/types';
import { DdMenu, DdMenuHeader, DdMenuHeaderButton, DdMenuItems } from '@/components';
import { AddTag, EditTag, TagList } from '@/pages/boards/components';

enum MenuStatus {
  TagList = 'Labels',
  NewTag = 'Create label',
  EditTag = 'Change label',
}

type MenuState = { name?: string | undefined; tag?: Tag | undefined } & (
  | {
      status: MenuStatus.TagList;
      isPrev: false;
      isTagList: true;
      isNewTag: false;
      isEditTag: false;
    }
  | {
      status: MenuStatus.NewTag;
      isPrev: true;
      isTagList: false;
      isNewTag: true;
      isEditTag: false;
    }
  | {
      status: MenuStatus.EditTag;
      isPrev: true;
      isTagList: false;
      isNewTag: false;
      isEditTag: true;
    }
);

const MENU_PREV = 'PREV';
const MENU_TAG_LIST = 'TAG_LIST';
const MENU_NEW_TAG = 'NEW_TAG';
const MENU_EDIT_TAG = 'EDIT_TAG';

type MenuAction =
  | { type: 'PREV' }
  | { type: 'TAG_LIST' }
  | { type: 'NEW_TAG'; name: string }
  | { type: 'EDIT_TAG'; tag: Tag };

const getMenuState = (status: MenuStatus): MenuState => {
  return {
    status,
    isPrev: status !== MenuStatus.TagList,
    isTagList: status === MenuStatus.TagList,
    isNewTag: status === MenuStatus.NewTag,
    isEditTag: status === MenuStatus.EditTag,
  } as MenuState;
};

const initialState = getMenuState(MenuStatus.TagList);

const reducer = (state: MenuState, action: MenuAction): MenuState => {
  switch (action.type) {
    case MENU_PREV:
    case MENU_TAG_LIST:
      return getMenuState(MenuStatus.TagList);
    case MENU_NEW_TAG:
      return { ...getMenuState(MenuStatus.NewTag), name: action.name };
    case MENU_EDIT_TAG:
      return { ...getMenuState(MenuStatus.EditTag), tag: action.tag };
    default:
      throw new Error();
  }
};

export type TagListMenuProps = {
  className?: string | undefined;
  menuRef: React.MutableRefObject<null | HTMLDivElement>;
  targetRef: React.RefObject<null | undefined | HTMLElement | SVGElement>;
  isOpened: boolean;
  boardId: string;
  selected: string[];
  onSelect: (tag: Tag) => void;
  onDelete?: () => void;
  onClose?: () => void;
};

export const TagListMenu: React.FC<TagListMenuProps> = ({
  className,
  menuRef,
  targetRef,
  isOpened,
  boardId,
  selected,
  onSelect,
  onDelete,
  onClose,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onPrev = useCallback(
    (type?: 'add' | 'edit' | 'delete' | undefined) => {
      if (type === 'delete' && onDelete) {
        onDelete();
      }

      dispatch({ type: MENU_PREV });
    },
    [onDelete]
  );

  const onNewTag = useCallback(
    (name) => {
      dispatch({ type: MENU_NEW_TAG, name });
    },
    [dispatch]
  );

  const onEditTag = useCallback(
    (tag) => {
      dispatch({ type: MENU_EDIT_TAG, tag });
    },
    [dispatch]
  );

  useEffect(() => {
    if (!isOpened) {
      dispatch({ type: MENU_TAG_LIST });
    }
  }, [isOpened]);

  return (
    <DdMenu ref={menuRef} targetRef={targetRef} hidden={!isOpened} className={className}>
      <DdMenuHeader>
        {state.isPrev && (
          <DdMenuHeaderButton left={true} onClick={() => onPrev()}>
            <RiArrowLeftSLine />
          </DdMenuHeaderButton>
        )}
        {state.status}
        <DdMenuHeaderButton onClick={onClose}>
          <RiCloseLine />
        </DdMenuHeaderButton>
      </DdMenuHeader>
      {state.isTagList && (
        <DdMenuItems>
          <TagList
            boardId={boardId}
            onSelect={onSelect}
            selected={selected}
            onNewTag={onNewTag}
            onEditTag={onEditTag}
          />
        </DdMenuItems>
      )}
      {state.isNewTag && (
        <DdMenuItems>
          <AddTag boardId={boardId} name={state.name} callback={() => onPrev('add')} />
        </DdMenuItems>
      )}
      {state.isEditTag && (
        <DdMenuItems>
          <EditTag tag={state.tag!} callback={onPrev} />
        </DdMenuItems>
      )}
    </DdMenu>
  );
};

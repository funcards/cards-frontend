import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dialog } from '@reach/dialog';
import { RiLayoutTop2Line, RiAddLine } from 'react-icons/ri';
import { TiTags } from 'react-icons/ti';
import { BsJustifyLeft } from 'react-icons/bs';

import { Card, Tag } from '@/types';
import { Button, ButtonClose, Form, FormRow, TextField } from '@/components';
import { useAppDispatch, useAppSelector, useSwitchElement } from '@/hooks';
import { editCard, selectBoardCategory, selectBoardTagsByIds, selectCards } from '@/store';
import { ChildrenProps } from '@/components/types';
import { cardName } from '@/validators';
import { TagListMenu } from '@/pages/boards/components';

import styles from './CardView.module.scss';

type RowProps = ChildrenProps & {
  left?: React.ReactNode | undefined;
  right?: React.ReactNode | undefined;
};

type BaseProps = {
  card: Card;
  lock?: boolean | undefined;
  onSave: (data: Partial<Card> & Pick<Card, 'board_id' | 'card_id'>) => void;
};

const Row: React.FC<RowProps> = ({ children, left, right }) => (
  <div className={styles.row}>
    {left && <div className={`${styles.col} ${styles.col_left}`}>{left}</div>}
    {children && <div className={`${styles.col} ${styles.col_content}`}>{children}</div>}
    {right && <div className={`${styles.col} ${styles.col_right}`}>{right}</div>}
  </div>
);

type CardHeaderProps = BaseProps & {
  onCloseModal?: () => void;
};

const CardHeader: React.FC<CardHeaderProps> = ({ card, lock, onSave, onCloseModal }) => {
  const category = useAppSelector((state) =>
    selectBoardCategory(state, { board_id: card.board_id, category_id: card.category_id })
  );
  const [name, setName] = useState(card.name);

  const closeFn = useCallback(() => {
    if (cardName.isValidSync(name) && card.name !== name) {
      onSave({ board_id: card.board_id, card_id: card.card_id, name });
    } else {
      setName(card.name);
    }
  }, [card.board_id, card.card_id, card.name, name, onSave]);

  const inputRef: React.MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);
  const { ref, isOpened, onOpen, onClose } = useSwitchElement<HTMLDivElement>(false, closeFn);

  const onChange = useCallback((e) => setName(e.target.value), []);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpened && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpened]);

  if (!category) {
    return <></>;
  }

  return (
    <Row
      left={<RiLayoutTop2Line />}
      right={onCloseModal && <ButtonClose className={styles.close} onClick={onCloseModal} />}
    >
      <div ref={ref}>
        <h2
          className={isOpened ? `${styles.header__title} ${styles.header__title_open}` : styles.header__title}
          onClick={onOpen}
        >
          {name}
        </h2>
        <TextField
          className={isOpened ? `${styles.header__input} ${styles.header__input_open}` : styles.header__input}
          ref={inputRef}
          readOnly={!!lock}
          value={name}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      </div>
      <div className={styles.header__category}>
        in list
        <span>{category.name}</span>
      </div>
    </Row>
  );
};

type CardTagsProps = BaseProps;

const CardTags: React.FC<CardTagsProps> = ({ card, lock, onSave }) => {
  const tags = useAppSelector((state) => selectBoardTagsByIds(state, { board_id: card.board_id, tags_id: card.tags }));
  const tagsId = useMemo(() => tags.map((t) => t.tag_id), [tags]);

  const buttonRef: React.MutableRefObject<HTMLButtonElement | null> = useRef(null);
  const { ref: menuRef, isOpened, onOpen, onClose } = useSwitchElement<HTMLDivElement>();

  const onSelect = useCallback(
    (tag: Tag) => {
      if (lock) {
        return;
      }

      const tags = tagsId.find((i) => i === tag.tag_id)
        ? tagsId.filter((i) => i !== tag.tag_id)
        : [...tagsId, tag.tag_id];

      onSave({ board_id: card.board_id, card_id: card.card_id, tags });
    },
    [card.board_id, card.card_id, lock, onSave, tagsId]
  );

  return (
    <Row left={<TiTags />}>
      <div className={styles.tags}>
        <h4 className={styles.tags__title}>Labels</h4>
        <div className={styles.tags__list}>
          {tags.map((tag) => (
            <Button
              type="button"
              key={tag.tag_id}
              primary={true}
              data-theme={tag.color}
              className={styles.tags__item}
              onClick={onOpen}
              disabled={lock}
            >
              {tag.name}
            </Button>
          ))}
          <Button ref={buttonRef} type="button" className={styles.tags__add} onClick={onOpen} disabled={lock}>
            <RiAddLine />
          </Button>
          <TagListMenu
            className={styles.tags__menu}
            menuRef={menuRef}
            targetRef={buttonRef}
            isOpened={isOpened}
            boardId={card.board_id}
            selected={tagsId}
            onSelect={onSelect}
            onClose={onClose}
          />
        </div>
      </div>
    </Row>
  );
};

type CardContentProps = BaseProps;

const placeholder = 'Add a more detailed description…';

const CardContent: React.FC<CardContentProps> = ({ card, lock, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [newContent, setNewContent] = useState(card.content);
  const contentRef: React.MutableRefObject<HTMLTextAreaElement | null> = useRef<HTMLTextAreaElement>(null);
  const content = useMemo(() => card.content || placeholder, [card.content]);
  const contentClassName = useMemo(() => {
    const cn = [styles.description__content];
    card.content === '' && cn.push(styles.description__content_empty);
    isOpen && cn.push(styles.description__content_open);

    return cn.join(' ');
  }, [card.content, isOpen]);
  const formClassName = useMemo(
    () => (isOpen ? `${styles.description__form} ${styles.description__form_open}` : styles.description__form),
    [isOpen]
  );

  const onChange = useCallback((e) => setNewContent(e.target.value), []);

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (card.content === newContent) {
        setNewContent(card.content);
        onClose();
      } else {
        onSave({ board_id: card.board_id, card_id: card.card_id, content: newContent });
        setSubmit(true);
      }
    },
    [card.board_id, card.card_id, card.content, newContent, onClose, onSave]
  );

  useEffect(() => {
    if (isOpen) {
      contentRef.current?.focus();
      contentRef.current?.select();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!lock && submit) {
      setIsOpen(false);
      setSubmit(false);
    }
  }, [lock, submit]);

  return (
    <Row left={<BsJustifyLeft />}>
      <div className={styles.description}>
        <h3 className={styles.description__title}>Description</h3>
        <div className={contentClassName} onClick={onOpen}>
          {content}
        </div>
        <Form className={formClassName} onSubmit={onSubmit}>
          <TextField
            className={styles.description__input}
            ref={contentRef}
            multiLine={true}
            placeholder={placeholder}
            value={newContent}
            onChange={onChange}
          />
          <div className={styles.description__footer}>
            <Button
              type="submit"
              className={styles.description__save}
              primary={true}
              start={true}
              spinner={lock}
              disabled={lock}
            >
              Save
            </Button>
            <ButtonClose type="button" onClick={onClose} />
          </div>
        </Form>
      </div>
    </Row>
  );
};

export interface CardViewProps {
  card: Card;
  showCard: boolean;
  onClose: () => void;
}

export const CardView: React.FC<CardViewProps> = ({ showCard, card, onClose }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(selectCards);

  const onSave = useCallback(
    (data) => {
      dispatch(editCard(data));
    },
    [dispatch]
  );

  const base = useMemo(() => ({ card, lock: isLoading, onSave }), [card, isLoading, onSave]);

  return (
    <Dialog isOpen={showCard} onDismiss={onClose} className={styles.viewCard} aria-labelledby="card-view">
      <div className={styles.viewCard__wrapper}>
        <CardHeader onCloseModal={onClose} {...base} />
        <div className={styles.viewCard__body}>
          <div className={styles.viewCard__main}>
            <CardTags card={card} onSave={onSave} />
            <CardContent card={card} lock={isLoading} onSave={onSave} />
          </div>
          <div className={styles.viewCard__sidebar} />
        </div>
      </div>
    </Dialog>
  );
};

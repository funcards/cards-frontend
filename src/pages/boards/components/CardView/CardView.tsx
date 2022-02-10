import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dialog } from '@reach/dialog';
import { RiLayoutTop2Line, RiAddLine, RiCloseLine } from 'react-icons/ri';
import { TiTags } from 'react-icons/ti';
import { BsJustifyLeft } from 'react-icons/bs';

import { Card, Category, Tag } from '@/types';
import {
  Button,
  ButtonClose,
  DdMenu,
  DdMenuHeader,
  DdMenuHeaderButton,
  DdMenuItems,
  Form,
  TextField,
} from '@/components';
import { useAppDispatch, useAppSelector, useSwitchElement } from '@/hooks';
import {
  changeCardsPosition,
  editCard,
  selectBoardCards,
  selectBoardCategories,
  selectBoardTagsByIds,
  selectCards,
} from '@/store';
import { ChildrenProps } from '@/components/types';
import { cardName } from '@/validators';
import { TagListMenu } from '@/pages/boards/components';
import { normalizePosition } from '@/helpers';

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

type CardCategoryProps = {
  card: Card;
};

const CardCategory: React.FC<CardCategoryProps> = ({ card }) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => selectBoardCategories(state, card.board_id));
  const allCards = useAppSelector((state) => selectBoardCards(state, card.board_id));

  const category = useMemo(
    () => categories.find((c) => c.category_id === card.category_id),
    [card.category_id, categories]
  );
  const position = useMemo(
    () => allCards.filter((c) => c.category_id === card.category_id).findIndex((c) => c.card_id === card.card_id),
    [allCards, card.category_id, card.card_id]
  );

  const spanRef: React.MutableRefObject<HTMLSpanElement | null> = useRef(null);
  const catSelectRef: React.MutableRefObject<HTMLSelectElement | null> = useRef(null);
  const posSelectRef: React.MutableRefObject<HTMLSelectElement | null> = useRef(null);

  const { ref: menuRef, isOpened, onOpen, onClose } = useSwitchElement<HTMLDivElement>();

  const [cat, setCat] = useState<undefined | Category>();
  const [pos, setPos] = useState<undefined | number>();

  const cards = useMemo(() => allCards.filter((c) => c.category_id === cat?.category_id), [allCards, cat?.category_id]);

  const posLabel = useMemo(() => (undefined === pos ? '-' : pos + 1), [pos]);

  const catOptions = useMemo(
    () =>
      categories.map((c) => {
        const current = c.category_id === category?.category_id ? ' (current)' : '';

        return (
          <option key={c.category_id} value={c.category_id}>
            {c.name}
            {current}
          </option>
        );
      }),
    [categories, category]
  );

  const posOptions = useMemo(() => {
    const max = cat?.category_id === card.category_id ? cards.length : cards.length + 1;

    return [...Array(max).keys()].map((i) => {
      const current = i === position && cat?.category_id === card.category_id ? ' (current)' : '';
      const n = i + 1;

      return (
        <option key={i} value={i}>
          {n}
          {current}
        </option>
      );
    });
  }, [cat?.category_id, card.category_id, cards.length, position]);

  const onChangeCat = useCallback(
    (e) => setCat(categories.find((c) => c.category_id === e.target.value)),
    [categories]
  );

  const onChangePos = useCallback((e) => setPos(+e.target.value), []);

  const onMove = useCallback(() => {
    if (cat?.category_id && undefined !== pos) {
      const [source, destination] = normalizePosition(
        allCards,
        { droppableId: card.category_id, index: position },
        { droppableId: cat.category_id, index: pos }
      );

      if (source && destination) {
        dispatch(changeCardsPosition({ board_id: card.board_id, source, destination }));
      }
    }
    onClose();
  }, [allCards, card.board_id, card.category_id, cat?.category_id, dispatch, onClose, pos, position]);

  useEffect(() => {
    setCat(category);
  }, [category]);

  useEffect(() => {
    setPos(position);
  }, [position]);

  useEffect(() => {
    setPos(cat?.category_id === card.category_id ? position : cards.length);
  }, [card.category_id, cards.length, cat?.category_id, position]);

  if (!category || !cat) {
    return <></>;
  }

  return (
    <div className={styles.category}>
      in list
      <span ref={spanRef} onClick={onOpen}>
        {cat?.name}
      </span>
      <DdMenu className={styles.category__menu} ref={menuRef} targetRef={spanRef} hidden={!isOpened}>
        <DdMenuHeader>
          Move card
          <DdMenuHeaderButton onClick={onClose}>
            <RiCloseLine />
          </DdMenuHeaderButton>
        </DdMenuHeader>
        <DdMenuItems>
          <div className={`${styles.category__row} ${styles.category__row_title}`}>Select destination</div>
          <div className={styles.category__row}>
            <div className={styles.category__col}>
              <span className={styles.category__label}>List</span>
              <span className={styles.category__selected}>{cat.name}</span>
              <select
                ref={catSelectRef}
                className={styles.category__select}
                value={cat.category_id}
                onChange={onChangeCat}
              >
                {catOptions}
              </select>
            </div>
            <div className={styles.category__col}>
              <span className={styles.category__label}>Position</span>
              <span className={styles.category__selected}>{posLabel}</span>
              <select ref={posSelectRef} className={styles.category__select} value={pos} onChange={onChangePos}>
                {posOptions}
              </select>
            </div>
          </div>
          <div className={`${styles.category__row} ${styles.category__row_footer}`}>
            <Button type="button" className={styles.category__btn} primary={true} onClick={onMove}>
              Move
            </Button>
          </div>
        </DdMenuItems>
      </DdMenu>
    </div>
  );
};

type CardHeaderProps = BaseProps & {
  onCloseModal?: () => void;
};

const CardHeader: React.FC<CardHeaderProps> = ({ card, lock, onSave, onCloseModal }) => {
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
    if (isOpened) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isOpened]);

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
      <CardCategory card={card} />
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

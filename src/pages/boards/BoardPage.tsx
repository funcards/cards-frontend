import React, { useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { QueryStatus } from '@reduxjs/toolkit/src/query/core/apiState';

import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  changeCardsPosition,
  changeCategoriesPosition,
  closeBoardMenu,
  boardLoad,
  openBoardMenu,
  selectBoard,
  selectBoardCards,
  selectBoardCategories,
  selectBoards,
  selectUi,
} from '@/store';
import { ErrorWrapper, Loading, PageTitle } from '@/components';
import { DndType } from '@/types';
import { normalizePosition } from '@/helpers';

import styles from './BoardPage.module.scss';
import { AddCategory, BoardCategory, BoardHeader, BoardMenu } from './components';

const BoardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { boardId } = useParams<'boardId'>();
  const { loading } = useAppSelector(selectBoards);
  const board = useAppSelector((state) => selectBoard(state, boardId!));
  const categories = useAppSelector((state) => selectBoardCategories(state, boardId!));
  const cards = useAppSelector((state) => selectBoardCards(state, boardId!));
  const isLoading = useMemo(() => loading === QueryStatus.pending, [loading]);
  const isError = useMemo(() => loading === QueryStatus.rejected, [loading]);
  const title = useMemo(() => (board ? board.name : 'Board'), [board]);
  const position = useMemo(
    () => (categories.length > 0 ? categories[categories.length - 1].position + 1 : 0),
    [categories]
  );
  const { boardMenuIsOpened } = useAppSelector(selectUi);
  const onOpenMenu = useCallback(() => dispatch(openBoardMenu()), [dispatch]);
  const onCloseMenu = useCallback(() => dispatch(closeBoardMenu()), [dispatch]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, type } = result;

      if (!destination) {
        return;
      }

      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return;
      }

      if (type === DndType.Category) {
        dispatch(
          changeCategoriesPosition({
            board_id: boardId!,
            source: source.index,
            destination: destination.index,
          })
        );

        return;
      }

      const [s, d] = normalizePosition(cards, source, destination);

      if (s && d) {
        dispatch(
          changeCardsPosition({
            board_id: boardId!,
            source: s,
            destination: d,
          })
        );
      }
    },
    [boardId, cards, dispatch]
  );

  useEffect(() => {
    dispatch(boardLoad(boardId!));
  }, [dispatch, boardId]);

  return (
    <>
      {isError && !board ? (
        <ErrorWrapper
          errorTitle="Board Not Found"
          errorMessage="This board may be private. If someone gave you this link, they may need to invite you to one of their boards."
        />
      ) : (
        <>
          <PageTitle title={title} />
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {board && (
                <main className={styles.boardPage}>
                  <Helmet htmlAttributes={{ 'data-theme': board.color }} />
                  <div className={styles.boardPage__content}>
                    <BoardHeader board={board} menuIsOpened={boardMenuIsOpened} onOpenMenu={onOpenMenu} />
                    <div className={styles.boardPage__wrapper}>
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="categories" direction="horizontal" type={DndType.Category}>
                          {(provided) => (
                            <div
                              className={styles.boardPage__categories}
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {categories.map((category, index) => (
                                <BoardCategory
                                  key={category.category_id}
                                  category={category}
                                  boardColor={board.color}
                                  index={index}
                                />
                              ))}
                              {provided.placeholder}
                              <div className={styles.boardPage__addCategory}>
                                <AddCategory boardId={boardId!} boardColor={board.color} position={position} />
                              </div>
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </div>
                  </div>
                  <BoardMenu board={board} menuIsOpened={boardMenuIsOpened} onCloseMenu={onCloseMenu} />
                </main>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default BoardPage;

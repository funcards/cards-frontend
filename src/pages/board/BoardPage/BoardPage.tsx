import React, { useCallback, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'

import { BoardHeader, BoardCategory, AddCategory, BoardMenu } from '~src/pages/board/components'
import { DndType } from '~src/store/types'
import { useAppDispatch, useTypedSelector } from '~src/store'
import { selectBoard, selectBoardState, selectCards, selectCategories } from '~src/store/board/board.selectors'
import { BoardStateStatus } from '~src/store/board/board.types'
import { selectUiState } from '~src/store/ui/ui.selectors'
import { closeBoardMenu, openBoardMenu } from '~src/store/ui/ui.slice'
import { changeCardsPosition, changeCategoriesPosition, loadBoard } from '~src/store/board/board.slice'
import { ErrorWrapper, Loading, PageTitle } from '~src/components'

import * as classes from './BoardPage.module.scss'

const BoardPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { status, isError } = useTypedSelector(selectBoardState)
  const { boardId } = useParams<'boardId'>()
  const board = useTypedSelector((state) => selectBoard(state, boardId!))
  const categories = useTypedSelector((state) => selectCategories(state, boardId!))
  const cards = useTypedSelector((state) => selectCards(state, boardId!))
  const isLoading = useMemo(() => BoardStateStatus.LoadOneBoard === status, [status])
  const title = useMemo(() => (board ? board.name : 'Board'), [board])
  const position = useMemo(
    () => (categories.length > 0 ? categories[categories.length - 1].position + 1 : 0),
    [categories]
  )
  const { boardMenuIsOpened } = useTypedSelector(selectUiState)
  const onOpenMenu = useCallback(() => dispatch(openBoardMenu()), [dispatch])
  const onCloseMenu = useCallback(() => dispatch(closeBoardMenu()), [dispatch])

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, type } = result

      if (!destination) {
        return
      }

      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return
      }

      if (type === DndType.Category) {
        dispatch(
          changeCategoriesPosition({
            board_id: boardId!,
            source: source.index,
            destination: destination.index,
          })
        )

        return
      }

      let d = 0
      let from = -1
      let to = -1

      for (let i = 0, s = 0; i < cards.length; i++) {
        if (from === -1 && cards[i].category_id === source.droppableId) {
          if (s === source.index) {
            from = i
          }
          s++
        }

        if (to === -1 && cards[i].category_id === destination.droppableId) {
          if (d === destination.index) {
            to = i
          }
          d++
        }

        if (from > -1 && to > -1) {
          break
        }
      }

      if (-1 === from) {
        return
      }

      if (-1 === to) {
        to = d
      }

      dispatch(
        changeCardsPosition({
          board_id: boardId!,
          source: {
            category_id: source.droppableId,
            index: from,
          },
          destination: {
            category_id: destination.droppableId,
            index: to,
          },
        })
      )
    },
    [boardId, cards, dispatch]
  )

  useEffect(() => {
    dispatch(loadBoard(boardId!))
  }, [dispatch, boardId])

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
                <main className={classes.boardPage}>
                  <Helmet htmlAttributes={{ 'data-theme': board.color }} />
                  <div className={classes.boardPage__content}>
                    <BoardHeader board={board} menuIsOpened={boardMenuIsOpened} onOpenMenu={onOpenMenu} />
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="categories" direction="horizontal" type={DndType.Category}>
                        {(provided) => (
                          <div
                            className={classes.boardPage__categories}
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
                            <div className={classes.boardPage__addCategory}>
                              <AddCategory boardId={boardId!} boardColor={board.color} position={position} />
                            </div>
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                  <BoardMenu boardColor={board.color} menuIsOpened={boardMenuIsOpened} onCloseMenu={onCloseMenu} />
                </main>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}

export default BoardPage

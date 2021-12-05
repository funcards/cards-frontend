import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'

import * as classes from './BoardPage.module.scss'

import { useAppDispatch, useTypedSelector } from '~src/store'
import { Loading } from '~src/modules/common/components/Loading/Loading'
import { selectBoard, selectBoardSate, selectCategories } from '~src/modules/board/board.selectors'
import NotFound from '~src/modules/common/components/NotFound/NotFound'
import { BoardStateStatus } from '~src/modules/board/board.types'
import { DndType } from '~src/modules/common/common.types'
import { loadBoard } from '~src/modules/board/board.slice'
import { PageTitle } from '~src/modules/common/components/PageTitle/PageTitle'
import { BoardHeader } from '~src/modules/board/components/BoardHeader/BoardHeader'
import { BoardMenu } from '~src/modules/board/components/BoardMenu/BoardMenu'
import { BoardCategory } from '~src/modules/board/components/BoardCategory/BoardCategory'
import { AddCategory } from '~src/modules/board/components/AddCategory/AddCategory'

const BoardPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { status, isError } = useTypedSelector(selectBoardSate)
  const { boardId } = useParams<'boardId'>()
  const board = useTypedSelector((state) => selectBoard(state, boardId ?? ''))
  const categories = useTypedSelector((state) => selectCategories(state, boardId ?? ''))
  const isLoading = useMemo(() => BoardStateStatus.LoadOneBoard === status, [status])
  const title = useMemo(() => (board ? board.name : 'Board'), [board])
  const position = useMemo(() => {
    const length = categories.ids.length

    return length > 0 ? categories.items[categories.ids[length - 1]].position : 0
  }, [categories])

  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const onOpenMenu = () => setIsOpenMenu(true)
  const onCloseMenu = () => setIsOpenMenu(false)

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result

    if (!destination) {
      return
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    if (type === DndType.Category) {
      // dispatch(updateCategoryPosition({ source, destination }))

      return
    }

    // dispatch(updateCardPosition({ source, destination }))
  }

  useEffect(() => {
    if (boardId) {
      dispatch(loadBoard(boardId))
    }
  }, [dispatch, boardId])

  return (
    <>
      {isError && !board ? (
        <NotFound />
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
                  <BoardHeader board={board} isOpenMenu={isOpenMenu} onOpenMenu={onOpenMenu} />
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="categories" direction="horizontal" type={DndType.Category}>
                      {(provided) => (
                        <div className={classes.boardPage__wrapper}>
                          <div
                            className={classes.boardPage__categories}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {categories.ids.map((id, index) => (
                              <BoardCategory
                                key={id}
                                category={categories.items[id]}
                                boardColor={board.color}
                                index={index}
                              />
                            ))}
                            {provided.placeholder}
                            <div className={classes.boardPage__addCategory}>
                              <AddCategory boardId={boardId!} boardColor={board.color} position={position} />
                            </div>
                          </div>
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  <BoardMenu boardColor={board.color} isOpenMenu={isOpenMenu} onCloseMenu={onCloseMenu} />
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

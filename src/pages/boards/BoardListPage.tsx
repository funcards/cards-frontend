import React, { useEffect, useMemo } from 'react';
import { TiBook } from 'react-icons/ti';
import { QueryStatus } from '@reduxjs/toolkit/src/query/core/apiState';

import { boardsLoad, selectBoards } from '@/store';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { Loading, PageTitle } from '@/components';

import { BoardList } from './components';
import styles from './BoardListPage.module.scss';

const BoardListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { boards, loadedAll, loading } = useAppSelector(selectBoards);
  const isLoading = useMemo(() => loading === QueryStatus.pending, [loading]);

  useEffect(() => {
    if (!loadedAll) {
      dispatch(boardsLoad());
    }
  }, [dispatch, loadedAll]);

  return (
    <>
      <PageTitle title="Boards" />
      {isLoading ? (
        <Loading />
      ) : (
        <main className={styles.boardListPage}>
          <div className={styles.boardListPage__container}>
            <h1 className={styles.boardListPage__title}>
              <TiBook className={styles.boardListPage__icon} />
              Your Workspace Boards
            </h1>
            <BoardList boards={boards} />
          </div>
        </main>
      )}
    </>
  );
};

export default BoardListPage;

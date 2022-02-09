import React, { useCallback, useMemo, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Dialog } from '@reach/dialog';
import { RiCheckLine } from 'react-icons/ri';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { closeAddBoard, newBoard, selectAuth, selectBoards, selectUi } from '@/store';
import { routes } from '@/config';
import { Button, ButtonClose, Form, FormError, FormRow, TextField } from '@/components';
import { DraftBoard, Theme } from '@/types';
import { boardDescription, boardName, theme } from '@/validators';

import styles from './AddBoard.module.scss';

const schema = yup
  .object({
    name: boardName,
    color: theme,
    description: boardDescription,
  })
  .required();

export const AddBoard: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(selectAuth);
  const { addBoardDialogIsOpened } = useAppSelector(selectUi);
  const { isLoading } = useAppSelector(selectBoards);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid },
  } = useForm<DraftBoard>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { color: Theme.Sky },
  });

  const { ref, ...rest } = register('name');
  const nameRef: React.MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);
  const disabled = useMemo(() => isLoading || !isDirty || !isValid, [isLoading, isDirty, isValid]);
  const isRedirect = useMemo(
    () => !isAuthenticated && addBoardDialogIsOpened && !location.state,
    [addBoardDialogIsOpened, isAuthenticated, location.state]
  );

  const onSubmit = useCallback((data) => dispatch(newBoard(data)), [dispatch]);
  const onDismiss = useCallback(() => dispatch(closeAddBoard()), [dispatch]);

  if (isRedirect) {
    return <Navigate to={routes.auth.signIn} state={{ from: location }} />;
  }

  if (!isAuthenticated) {
    return <></>;
  }

  return (
    <Dialog
      isOpen={addBoardDialogIsOpened}
      initialFocusRef={nameRef}
      aria-labelledby="add-board"
      className={styles.addBoard}
    >
      <div className={styles.addBoard__wrapper}>
        <h2 className={styles.addBoard__title}>
          Add new board
          <ButtonClose onClick={onDismiss} />
        </h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormRow>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <div className={styles.addBoard__colorList}>
                  {Object.values(Theme)
                    .filter((t) => t !== Theme.NoColor)
                    .map((t) => (
                      <div key={t} data-theme={t} className={styles.addBoard__color} onClick={() => field.onChange(t)}>
                        {t === field.value && <RiCheckLine />}
                      </div>
                    ))}
                </div>
              )}
            />
          </FormRow>
          <FormRow>
            <TextField
              type="text"
              placeholder="Board title"
              error={errors.name}
              ref={(e: HTMLInputElement | null) => {
                ref(e);
                nameRef.current = e;
              }}
              {...rest}
            />
            <FormError error={errors.name} />
          </FormRow>
          <FormRow>
            <TextField
              placeholder="Description"
              multiLine={true}
              error={errors.description}
              {...register('description')}
            />
            <FormError error={errors.description} />
          </FormRow>
          <FormRow>
            <Button type="submit" primary={true} end={true} disabled={disabled} spinner={isLoading}>
              Create board
            </Button>
          </FormRow>
        </Form>
      </div>
    </Dialog>
  );
};

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BsJustifyLeft } from 'react-icons/bs';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import * as yup from 'yup';
import { TiTimes } from 'react-icons/ti';

import { Button, Form, FormError, FormRow, TextField } from '@/components';
import { boardDescription } from '@/validators';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { editBoard, selectBoards } from '@/store';

import styles from './BoardDescription.module.scss';

export type BoardDescriptionProps = {
  boardId: string;
  description: string;
};

const schema = yup
  .object({
    description: boardDescription,
  })
  .required();

export const BoardDescription: React.FC<BoardDescriptionProps> = ({ boardId, description }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(selectBoards);
  const [isOpen, setIsOpen] = useState(false);
  const [submit, setSubmit] = useState(false);
  const desc = useMemo(() => description || 'Description...', [description]);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { board_id: boardId, description },
  });

  const disabled = useMemo(() => isLoading || !isValid, [isLoading, isValid]);

  const { ref, ...rest } = register('description');
  const descriptionRef: React.MutableRefObject<HTMLTextAreaElement | null> = useRef<HTMLTextAreaElement>(null);

  const onSubmit = useCallback(
    (data) => {
      if (data.description !== description) {
        dispatch(editBoard(data));
      }

      setSubmit(true);
    },
    [description, dispatch]
  );

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => {
    setIsOpen(false);
    if (description !== getValues('description')) {
      reset();
    }
  }, [description, getValues, reset]);

  useEffect(() => {
    if (isOpen) {
      descriptionRef.current?.focus();
      descriptionRef.current?.select();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isLoading && submit) {
      setIsOpen(false);
      setSubmit(false);
    }
  }, [isLoading, reset, submit]);

  return (
    <div className={styles.description}>
      <h4 className={styles.description__title}>
        <BsJustifyLeft /> Description
      </h4>
      <div
        className={isOpen ? `${styles.description__text} ${styles.description__text_open}` : styles.description__text}
        onClick={onOpen}
      >
        {desc}
      </div>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className={isOpen ? `${styles.description__form} ${styles.description__form_open}` : styles.description__form}
      >
        <FormRow>
          <TextField
            className={styles.description__input}
            multiLine={true}
            placeholder={desc}
            error={errors.description}
            ref={(e: HTMLTextAreaElement | null) => {
              ref(e);
              descriptionRef.current = e;
            }}
            {...rest}
          />
          <FormError error={errors.description} />
        </FormRow>
        <FormRow className={styles.description__footer}>
          <Button
            type="submit"
            className={styles.description__save}
            primary={true}
            start={true}
            spinner={isLoading}
            disabled={disabled}
          >
            Save
          </Button>
          <Button close={true} onClick={onClose}>
            <TiTimes />
          </Button>
        </FormRow>
      </Form>
    </div>
  );
};

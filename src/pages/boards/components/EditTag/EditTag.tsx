import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { v4 as uuid } from 'uuid';
import { RiCheckLine } from 'react-icons/ri';

import { deleteTag, editTag, selectTags } from '@/store';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { Tag, Theme } from '@/types';
import { tagName, theme } from '@/validators';
import { Button, Form, FormError, FormRow, TextField } from '@/components';

import styles from './EditTag.module.scss';

export type EditTagProps = {
  tag: Tag;
  callback?: (type: 'edit' | 'delete') => void;
};

const schema = yup
  .object({
    name: tagName,
    color: theme,
  })
  .required();

export const EditTag: React.FC<EditTagProps> = ({ tag, callback }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(selectTags);
  const [nameId, setNameId] = useState('edit-tag-name');
  const [submit, setSubmit] = useState<false | 'edit' | 'delete'>(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<Tag>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { ...tag },
  });

  const isLoadingSave = useMemo(() => isLoading && submit === 'edit', [isLoading, submit]);
  const isLoadingDelete = useMemo(() => isLoading && submit === 'delete', [isLoading, submit]);
  const disabled = useMemo(() => isLoadingSave || !isValid, [isLoadingSave, isValid]);
  const nameRef: React.MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);
  const { ref, ...rest } = register('name');

  const onSubmit = useCallback(
    (data) => {
      dispatch(editTag(data));
      setSubmit('edit');
    },
    [dispatch]
  );

  const onDelete = useCallback(() => {
    dispatch(deleteTag({ board_id: tag.board_id, tag_id: tag.tag_id }));
    setSubmit('delete');
  }, [dispatch, tag.board_id, tag.tag_id]);

  useEffect(() => {
    setNameId(uuid());
    nameRef.current?.focus();
    nameRef.current?.select();
  }, []);

  useEffect(() => {
    if (!isLoading && submit && callback) {
      callback(submit);
    }
  }, [callback, isLoading, submit]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={styles.editTag}>
      <FormRow>
        <label htmlFor={nameId} className={styles.editTag__label}>
          Name
        </label>
        <TextField
          type="text"
          id={nameId}
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
        <span className={styles.editTag__label}>Select a color</span>
        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <div className={styles.editTag__colorList}>
              {Object.values(Theme).map((t) => (
                <div key={t} data-theme={t} onClick={() => field.onChange(t)} className={styles.editTag__color}>
                  {t === field.value && <RiCheckLine />}
                </div>
              ))}
              <span className={styles.editTag__noColor}>No color.</span>
            </div>
          )}
        />
      </FormRow>
      <FormRow className={styles.editTag__footer}>
        <Button type="submit" primary={true} disabled={disabled} spinner={isLoadingSave}>
          Save
        </Button>
        <Button
          type="button"
          light={true}
          disabled={isLoadingDelete}
          spinner={isLoadingDelete}
          onClick={onDelete}
          className={styles.editTag__btnDelete}
        >
          Delete
        </Button>
      </FormRow>
    </Form>
  );
};

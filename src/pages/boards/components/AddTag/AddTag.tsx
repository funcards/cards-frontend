import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { v4 as uuid } from 'uuid';
import { RiCheckLine } from 'react-icons/ri';

import { DraftTag, Theme } from '@/types';
import { tagName, theme } from '@/validators';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { Button, Form, FormError, FormRow, TextField } from '@/components';
import { newTag, selectTags } from '@/store';

import styles from './AddTag.module.scss';

const schema = yup
  .object({
    name: tagName,
    color: theme,
  })
  .required();

export type AddTagProps = {
  boardId: string;
  name?: string | undefined;
  callback?: () => void;
};

export const AddTag: React.FC<AddTagProps> = ({ boardId, name, callback }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(selectTags);
  const [nameId, setNameId] = useState('add-tag-name');
  const [submit, setSubmit] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setFocus,
    formState: { errors, isValid },
  } = useForm<DraftTag>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { board_id: boardId, name, color: Theme.NoColor },
  });

  const disabled = useMemo(() => isLoading || !isValid, [isLoading, isValid]);

  const onSubmit = useCallback(
    (data) => {
      dispatch(newTag(data));
      setSubmit(true);
    },
    [dispatch]
  );

  useEffect(() => {
    setNameId(uuid());
  }, []);

  useEffect(() => {
    setFocus('name');
  }, [setFocus]);

  useEffect(() => {
    if (!isLoading && submit && callback) {
      callback();
    }
  }, [callback, isLoading, submit]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={styles.addTag}>
      <FormRow>
        <label htmlFor={nameId} className={styles.addTag__label}>
          Name
        </label>
        <TextField type="text" id={nameId} error={errors.name} {...register('name')} />
        <FormError error={errors.name} />
      </FormRow>
      <FormRow>
        <span className={styles.addTag__label}>Select a color</span>
        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <div className={styles.addTag__colorList}>
              {Object.values(Theme).map((t) => (
                <div key={t} data-theme={t} onClick={() => field.onChange(t)} className={styles.addTag__color}>
                  {t === field.value && <RiCheckLine />}
                </div>
              ))}
              <span className={styles.addTag__noColor}>No color.</span>
            </div>
          )}
        />
      </FormRow>
      <FormRow>
        <Button type="submit" primary={true} start={true} disabled={disabled} spinner={isLoading}>
          Create
        </Button>
      </FormRow>
    </Form>
  );
};

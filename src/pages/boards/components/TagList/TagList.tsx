import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RiCheckLine } from 'react-icons/ri';

import { Button, TextField } from '@/components';
import { useAppSelector } from '@/hooks';
import { selectBoardTags } from '@/store';
import { Tag } from '@/types';

import styles from './TagList.module.scss';

export type LabelListProps = {
  boardId: string;
  onSelect: (tag_id: string) => void;
  selected?: string[];
};

export const TagList: React.FC<LabelListProps> = ({ boardId, onSelect, selected }) => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<Tag[]>([]);
  const tags = useAppSelector((state) => selectBoardTags(state, boardId));
  const label = useMemo(() => {
    const search = query.length && !data.length ? `"${query}" ` : '';

    return `Create a new ${search}label`;
  }, [data.length, query]);

  const onChange = useCallback((e) => setQuery(e.target.value), []);

  const find = useCallback((id) => !!selected?.find((i) => i === id), [selected]);

  useEffect(() => {
    setData(tags);
  }, [tags]);

  useEffect(() => {
    const newData = tags.filter((t) => t.name.toLowerCase().startsWith(query.toLowerCase()));
    setData(newData);
  }, [query, tags]);

  return (
    <div className={styles.tags}>
      <TextField placeholder="Search labels..." value={query} onChange={onChange} />
      <div className={styles.tags__container}>
        <h5>Labels</h5>
        {data.length > 0 && (
          <div className={styles.tags__list}>
            {data.map((tag) => (
              <Button
                key={tag.tag_id}
                onClick={() => onSelect(tag.tag_id)}
                primary={true}
                left={true}
                data-theme={tag.color}
              >
                {tag.name}
                {find(tag.tag_id) && <RiCheckLine className={styles.tags__selected} />}
              </Button>
            ))}
          </div>
        )}
      </div>
      <Button className={styles.tags__btnAddTag}>{label}</Button>
    </div>
  );
};

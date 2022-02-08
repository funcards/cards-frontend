import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RiCheckLine, RiPencilLine } from 'react-icons/ri';

import { Button, TextField } from '@/components';
import { useAppSelector } from '@/hooks';
import { selectBoardTags } from '@/store';
import { Tag } from '@/types';

import styles from './TagList.module.scss';

export type TagListProps = {
  boardId: string;
  selected?: string[];
  onNewTag: (name: string) => void;
  onEditTag: (tag: Tag) => void;
  onSelect: (tag: Tag) => void;
};

export const TagList: React.FC<TagListProps> = ({ boardId, onSelect, selected, onNewTag: newTag, onEditTag }) => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<Tag[]>([]);
  const tags = useAppSelector((state) => selectBoardTags(state, boardId));
  const label = useMemo(() => {
    const search = query.length && !data.length ? `"${query}" ` : '';

    return `Create a new ${search}label`;
  }, [data.length, query]);

  const onChange = useCallback((e) => setQuery(e.target.value), []);

  const onNewTag = useCallback(() => newTag(query), [newTag, query]);

  const find = useCallback((id) => !!selected?.find((i) => i === id), [selected]);

  useEffect(() => {
    const newData = tags.filter((t) => t.name.toLowerCase().startsWith(query.toLowerCase()));
    setData(newData);
  }, [query, tags]);

  return (
    <div className={styles.tags}>
      <TextField placeholder="Search labels..." value={query} onChange={onChange} />
      <div className={styles.tags__container}>
        <h5 className={styles.tags__listTitle}>Labels</h5>
        {data.length > 0 && (
          <div className={styles.tags__list}>
            {data.map((tag) => (
              <div key={tag.tag_id} className={styles.tags__listItem}>
                <Button
                  type="button"
                  onClick={() => onSelect(tag)}
                  primary={true}
                  left={true}
                  data-theme={tag.color}
                  className={styles.tags__tag}
                >
                  {tag.name}
                  {find(tag.tag_id) && <RiCheckLine className={styles.tags__selected} />}
                </Button>
                <button type="button" className={styles.tags__btnEditTag} onClick={() => onEditTag(tag)}>
                  <RiPencilLine />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Button className={styles.tags__btnAddTag} onClick={onNewTag}>
        {label}
      </Button>
    </div>
  );
};

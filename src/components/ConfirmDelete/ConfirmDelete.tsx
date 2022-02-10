import React, { useCallback, useRef, useState } from 'react';
import { AlertDialog, AlertDialogDescription, AlertDialogLabel } from '@reach/alert-dialog';

import { Button } from '@/components';

import styles from './ConfirmDelete.module.scss';

export type ConfirmDeleteProps = {
  message: string;
  onClose: () => void;
  onDelete: () => void;
};

export const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({ message, onClose, onDelete: deleteFn }) => {
  const [deleting, setDeleting] = useState(false);
  const cancelRef: React.MutableRefObject<HTMLButtonElement | null> = useRef(null);

  const onDelete = useCallback(() => {
    setDeleting(true);
    deleteFn();
  }, [deleteFn]);

  return (
    <AlertDialog leastDestructiveRef={cancelRef} className={styles.dialog}>
      <AlertDialogLabel className={styles.dialog__title}>Please Confirm!</AlertDialogLabel>
      <AlertDialogDescription className={styles.dialog__message}>{message}</AlertDialogDescription>
      <div className={styles.dialog__footer}>
        <Button
          type="button"
          primary={true}
          spinner={deleting}
          disabled={deleting}
          onClick={onDelete}
          data-theme="danger"
        >
          Yes, delete
        </Button>
        <Button type="button" ref={cancelRef} primary={true} disabled={deleting} onClick={onClose} data-theme="gray">
          Don&apos;t delete.
        </Button>
      </div>
    </AlertDialog>
  );
};

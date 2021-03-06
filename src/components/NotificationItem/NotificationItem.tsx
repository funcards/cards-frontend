import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { RiCloseLine } from 'react-icons/ri';
import { useTimeout } from 'usehooks-ts';

import { removeNotification } from '@/store';
import { NotifyType, Notification } from '@/types';

import styles from './NotificationItem.module.scss';

export interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const rootElementRef = useRef<HTMLDivElement>(null!);
  const [parentStyle, setParentStyle] = useState({ height: '0px', overflow: 'auto', transition: 'none' });

  const classType = useMemo(() => {
    switch (notification.type) {
      case NotifyType.Success:
        return styles.notification__container_success;
      case NotifyType.Warning:
        return styles.notification__container_warning;
      case NotifyType.Error:
        return styles.notification__container_error;
      default:
        return styles.notification__container_info;
    }
  }, [notification.type]);

  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    setTimeout(() => dispatch(removeNotification(notification)), 150);
    setParentStyle({
      height: '0px',
      overflow: 'hidden',
      transition: 'height 150ms linear 0ms',
    });
  }, [dispatch, notification]);

  useTimeout(onClose, notification.dismiss);

  useEffect(() => {
    const { scrollHeight } = rootElementRef.current;
    setParentStyle({
      overflow: 'auto',
      height: `${scrollHeight}px`,
      transition: 'height 300ms linear 0ms',
    });
  }, [rootElementRef, setParentStyle]);

  return (
    <div ref={rootElementRef} className={styles.notification} style={parentStyle}>
      <div onClick={onClose} className={`${styles.notification__container} ${classType}`}>
        {notification.title && (
          <div className={styles.notification__header}>
            <div className={styles.notification__title}>{notification.title}</div>
            <RiCloseLine />
          </div>
        )}
        <div className={styles.notification__message}>{notification.message}</div>
      </div>
    </div>
  );
};

import React from 'react';
import { Portal } from '@reach/portal';

import { useAppSelector } from '@/hooks';
import { selectNotifications } from '@/store';

import { NotificationItem } from '..';

import styles from './NotificationList.module.scss';

export const NotificationList: React.FC = () => {
  const { notifications } = useAppSelector(selectNotifications);

  return (
    <Portal>
      <div className={styles.notifications}>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </Portal>
  );
};

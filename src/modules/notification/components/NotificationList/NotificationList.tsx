import React from 'react'
import { useSelector } from 'react-redux'
import { Portal } from '@reach/portal'

import * as classes from './NotificationList.module.scss'

import { NotificationItem } from '~src/modules/notification/components/NotificationItem/NotificationItem'
import { getNotification } from '~src/modules/notification/notification.selectors'

export const NotificationList: React.FC = () => {
  const { notifications } = useSelector(getNotification)

  return (
    <Portal>
      <div className={classes.notifications}>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </Portal>
  )
}

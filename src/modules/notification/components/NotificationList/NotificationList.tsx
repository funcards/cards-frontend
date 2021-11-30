import React from 'react'
import { useSelector } from 'react-redux'

import * as classes from './NotificationList.module.scss'

import { NotificationItem } from '~src/modules/notification/components/NotificationItem/NotificationItem'
import { getNotification } from '~src/modules/notification/notification.selectors'

export const NotificationList: React.FC = () => {
  const { notifications } = useSelector(getNotification)

  return (
    <div className={classes.notifications}>
      <div className={classes.notifications__container}>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  )
}

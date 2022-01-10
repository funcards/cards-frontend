import React from 'react'
import { useSelector } from 'react-redux'
import { Portal } from '@reach/portal'

import { NotificationItem } from '~src/components'
import { selectNotification } from '~src/store/notification/notification.selectors'

import * as classes from './NotificationList.module.scss'

export const NotificationList: React.FC = () => {
  const { notifications } = useSelector(selectNotification)

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

import React from 'react'
import { useSelector } from 'react-redux'

import { Notification } from './Notification'

import { getNotifications } from '~src/store/selectors'

export const NotificationContainer: React.FC = () => {
  const { notifications } = useSelector(getNotifications)

  return (
    <div className="notifications">
      <div className="notifications__container">
        {notifications.map((notification) => (
          <Notification key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  )
}

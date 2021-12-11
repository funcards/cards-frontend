import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { TiTimes } from 'react-icons/ti'

import * as classes from './NotificationItem.module.scss'

import { NotifyType, Notification } from '~src/store/notification/notification.types'
import { removeNotification } from '~src/store/notification/notification.slice'

export interface NotificationItemProps {
  notification: Notification
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const rootElementRef = useRef<HTMLDivElement>(null!)
  const [parentStyle, setParentStyle] = useState({ height: '0px', overflow: 'auto', transition: 'none' })

  const classType = useMemo(() => {
    switch (notification.type) {
      case NotifyType.Success:
        return classes.notification__container_success
      case NotifyType.Warning:
        return classes.notification__container_warning
      case NotifyType.Error:
        return classes.notification__container_error
      default:
        return classes.notification__container_info
    }
  }, [notification.type])

  const dispatch = useDispatch()

  const onClose = useCallback(() => {
    setTimeout(() => dispatch(removeNotification(notification)), 150)
    setParentStyle({
      height: '0px',
      overflow: 'hidden',
      transition: 'height 150ms linear 0ms',
    })
  }, [dispatch, notification])

  useEffect(() => {
    const { scrollHeight } = rootElementRef.current
    setParentStyle({
      overflow: 'auto',
      height: `${scrollHeight}px`,
      transition: 'height 300ms linear 0ms',
    })
  }, [rootElementRef, setParentStyle])

  useEffect(() => {
    if (notification.dismiss! > 0) {
      const timeout = setTimeout(() => onClose(), notification.dismiss)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [notification.dismiss, onClose])

  return (
    <div ref={rootElementRef} className={classes.notification} style={parentStyle}>
      <div onClick={onClose} className={`${classes.notification__container} ${classType}`}>
        {notification.title && (
          <div className={classes.notification__header}>
            <div className={classes.notification__title}>{notification.title}</div>
            <TiTimes className={classes.notification__close} />
          </div>
        )}
        <div className={classes.notification__message}>{notification.message}</div>
      </div>
    </div>
  )
}

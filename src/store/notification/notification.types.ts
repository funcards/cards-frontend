export enum NotifyType {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

export interface Notification {
  id?: string
  type?: NotifyType
  title?: string
  message: string
  dismiss?: number
}

export interface NotificationState {
  notifications: Notification[]
}

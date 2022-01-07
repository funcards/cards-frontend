export interface CommonState {
  isLoading: boolean
  isError: boolean
  error?: ErrorResponse
  status?: string
}

export interface ValidationErrors {
  [key: string]: string[]
}

export interface ErrorResponse {
  type: string
  title: string
  status: number
  message: string
  errors?: ValidationErrors
}

export interface PaginatedResponse<T> {
  pageIndex: number
  pageSize: number
  count: number
  data: T[]
}

export enum Theme {
  Sky = 'sky',
  Blue = 'blue',
  Indigo = 'indigo',
  Red = 'red',
  Pink = 'pink',
  Orange = 'orange',
  Yellow = 'yellow',
  Lime = 'lime',
  Green = 'green',
  Gray = 'gray',
  NoColor = 'no-color',
}

export enum DndType {
  Category = 'CATEGORY',
  Card = 'CARD',
}

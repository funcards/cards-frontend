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
  data: Record<string, T>
}

import * as yup from 'yup'

import { Theme } from '~src/store/types'

export const themeSchema = yup.string().required().oneOf(Object.values(Theme))

export const boardNameSchema = yup.string().trim().required().max(150, 'Name is too long')

export const boardDescriptionSchema = yup.string().max(1000, 'Description is too long')

export const newBoardSchema = yup
  .object({
    name: boardNameSchema,
    color: themeSchema,
    description: boardDescriptionSchema,
  })
  .required()

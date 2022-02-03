import * as yup from 'yup';

export const password = yup
  .string()
  .required('Password is required')
  .min(8, 'Password is too short')
  .max(64, 'Password is too long')
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w\s\-^$&*!@#]{8,64}$/, 'Password field must be a valid password');

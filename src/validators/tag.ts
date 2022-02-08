import * as yup from 'yup';

export const tagName = yup.string().trim().required().max(100, 'Name is too long');

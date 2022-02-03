import * as yup from 'yup';

export const categoryName = yup.string().trim().required().max(150, 'Name is too long');

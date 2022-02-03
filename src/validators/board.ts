import * as yup from 'yup';

export const boardName = yup.string().trim().required().max(150, 'Name is too long');

export const boardDescription = yup.string().max(1000, 'Description is too long');

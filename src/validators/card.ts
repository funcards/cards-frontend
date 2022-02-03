import * as yup from 'yup';

export const cardName = yup.string().trim().required().max(255, 'Name is too long');

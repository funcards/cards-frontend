import * as yup from 'yup';

export const email = yup.string().required('Email is required').email('Email field must be a valid email');

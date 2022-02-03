import * as yup from 'yup';

import { Theme } from '@/types';

export const theme = yup.string().required().oneOf(Object.values(Theme));

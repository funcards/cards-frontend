import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

import { appLongName } from '@/config';

export interface PageTitleProps {
  title?: string;
  separator?: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({ title, separator }) => {
  const _title = useMemo(() => [title, appLongName].filter((i) => !!i).join(separator ?? ' | '), [title, separator]);

  return (
    <Helmet>
      <title>{_title}</title>
    </Helmet>
  );
};

import React from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type BreakpointProps = {
  show?: Breakpoint | undefined;
  hide?: Breakpoint | undefined;
};

export type ChildrenProps = {
  children?: React.ReactNode | undefined;
};

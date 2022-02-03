export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type BreakpointProps = {
  show?: Breakpoint | undefined;
  hide?: Breakpoint | undefined;
};

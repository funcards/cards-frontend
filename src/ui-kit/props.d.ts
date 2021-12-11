import React from 'react'

export type PropsOf<E extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>> =
  JSX.LibraryManagedAttributes<E, React.ComponentPropsWithoutRef<E>>

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export type BreakpointProps<E extends React.ElementType = React.ElementType> = {
  show?: Breakpoint | undefined
  hide?: Breakpoint | undefined
}

export type AsProps<E extends React.ElementType = React.ElementType> = BreakpointProps<E> & {
  as?: E
  children?: React.ReactNode | undefined
}

export type ExtendableProps<ExtendedProps = {}, OverrideProps = {}> = OverrideProps &
  Omit<ExtendedProps, keyof OverrideProps>

export type InheritableElementProps<E extends React.ElementType, Props = {}> = ExtendableProps<PropsOf<E>, Props>

export type PolymorphicComponentProps<E extends React.ElementType, Props = {}> = InheritableElementProps<
  E,
  Props & BreakpointProps<E>
>

export type AsPolymorphicComponentProps<E extends React.ElementType, Props = {}> = InheritableElementProps<
  E,
  Props & AsProps<E>
>

export type PolymorphicRef<E extends React.ElementType> = React.ComponentPropsWithRef<E>['ref']

export type PolymorphicComponentPropsWithRef<E extends React.ElementType, Props = {}> = PolymorphicComponentProps<
  E,
  Props
> & { ref?: PolymorphicRef<E> }

export type AsPolymorphicComponentPropsWithRef<E extends React.ElementType, Props = {}> = AsPolymorphicComponentProps<
  E,
  Props
> & { ref?: PolymorphicRef<E> }

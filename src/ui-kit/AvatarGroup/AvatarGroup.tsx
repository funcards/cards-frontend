import React, { forwardRef, useMemo } from 'react'

import { BreakpointProps } from '../props'
import { buildClassName, breakpointsClassName } from '../helpers'

import * as classes from './AvatarGroup.module.scss'

export interface AvatarGroupOwnProps {
  children?: React.ReactNode | undefined
}

export type AvatarGroupProps = AvatarGroupOwnProps & BreakpointProps & React.ComponentPropsWithRef<'ul'>

export type AvatarGroupComponent = (props: AvatarGroupProps) => React.ReactElement | null

const AvatarGroupRender = ({ children, ...props }: AvatarGroupProps, ref?: React.Ref<HTMLUListElement>) => {
  const rest = useMemo(() => {
    const { className, ...rest } = breakpointsClassName(props, classes, 'avatarGroup')

    return { ...rest, className: buildClassName(classes.avatarGroup, className) }
  }, [props])

  return (
    <ul ref={ref} {...rest}>
      {React.Children.map(children, (child, index) => (
        <li className={classes.avatarGroup__item} key={index}>
          {child}
        </li>
      ))}
    </ul>
  )
}

export const AvatarGroup: AvatarGroupComponent = forwardRef(AvatarGroupRender)

import React, { useMemo } from 'react'

import * as classes from './AuthFooter.module.scss'

export type AuthFooterProps = {
  children: React.ReactNode
}

export const AuthFooter: React.FC<AuthFooterProps> = ({ children }) => {
  const elements = useMemo(() => {
    const count = React.Children.count(children)

    return React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) {
        return child
      }

      const cloned = React.cloneElement(child, { ...child.props, key: index, className: classes.authFooter__link })

      if (index > 0 && index < count) {
        const dot = React.createElement('span', { key: count + index, className: classes.authFooter__dot })

        return React.createElement(React.Fragment, {}, [dot, cloned])
      }

      return cloned
    })
  }, [children])

  return (
    <div className={classes.authFooter}>
      <div className={classes.authFooter__container}>{elements}</div>
    </div>
  )
}

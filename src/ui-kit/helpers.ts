export const buildClassName = (...items: (string | undefined)[]): string => items.filter((i) => !!i).join(' ')

export const breakpointsClassName = (
  {
    className,
    show,
    hide,
    ...rest
  }: {
    [key: string]: any
  },
  classes: { [key: string]: string },
  classPrefix: string
) => {
  const c = (name: string, suffix?: string | undefined) => (suffix ? classes[classPrefix + name + suffix] : '')

  return { ...rest, className: buildClassName(className ?? '', c('_show_', show), c('_hide_', hide)) }
}

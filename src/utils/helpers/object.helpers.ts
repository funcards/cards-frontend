type Obj = {
  [key: string]: any
}

export const noUndefined = (obj: Obj) => {
  const newObj = { ...obj }
  Object.keys(newObj).forEach((key) => newObj[key] === undefined && delete newObj[key])

  return newObj
}

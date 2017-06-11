const assign = Object.assign || function (...args) {
  if (args[0] === null) {
    throw new TypeError('Cannot convert undefined or null to object')
  }
  const target = Object(args[0])
  for (let index = 1; index < args.length; index++) {
    let source = args[index]
    if (source != null) {
      /* eslint-disable no-restricted-syntax */
      for (let key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
      /* eslint-enable no-restricted-syntax */
    }
  }
  return target
}

export { assign as default }

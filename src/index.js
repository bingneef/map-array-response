// Find returns an value
export const mapValueResponse = (keys, field, values, { emptyValue = null } = {}) => (
  mapper('find', keys, field, values)
    .map(item => item == undefined ? emptyValue : item)
)

// Filter returns an array
export const mapArrayResponse = (...args) => mapper('filter', ...args, [])

// Share logic between mapArray and mapValue
const mapper = (funcName, keys, field, values) => {
  if (!Array.isArray(keys)) {
    throw 'Keys must be an array'
  }

  if (typeof field !== 'string') {
    throw 'Field must be a string'
  }

  const splittedField = field.split('.')
  return keys.map(key => values[funcName](item => key == get(splittedField, item)))
}

// Get the attributes from nested values
const get = (p, o) => (
  p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o)
)

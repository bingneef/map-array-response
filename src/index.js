// Get the attributes from nested values
const get = (p, o) => p.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), o);

// Share logic between mapArray and mapValue
const mapper = (funcName, keys, field, values) => {
  if (!Array.isArray(keys)) {
    throw new Error("Keys must be an array");
  }

  if (typeof field !== "string") {
    throw new Error("Field must be a string");
  }

  const splittedField = field.split(".");
  return keys.map(key =>
    values[funcName](item => key === get(splittedField, item))
  );
};

// Find returns an value
export const mapValueResponse = (
  keys,
  field,
  values,
  { emptyValue = null } = {}
) =>
  mapper("find", keys, field, values).map(item =>
    item === undefined ? emptyValue : item
  );

// Filter returns an array
export const mapArrayResponse = (...args) => mapper("filter", ...args, []);

// Value to value
export const mapValueToValueResponse = mapValueResponse;

// Value to array
export const mapValueToArrayResponse = mapArrayResponse;

// Array to Value
export const mapArrayToValueResponse = (arrKeys, ...args) =>
  arrKeys.map(keys => mapValueResponse(keys, ...args));

// Array to Array
export const mapArrayToArrayResponse = (arrKeys, ...args) =>
  arrKeys.map(keys => mapArrayResponse(keys, ...args));

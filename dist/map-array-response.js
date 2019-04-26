Object.defineProperty(exports, "__esModule", {
  value: true
});
// Find returns an value
const mapValueResponse = (exports.mapValueResponse = function mapValueResponse(
  keys,
  field,
  values
) {
  const _ref =
    arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const _ref$emptyValue = _ref.emptyValue;
  const emptyValue = _ref$emptyValue === undefined ? null : _ref$emptyValue;

  return mapper("find", keys, field, values).map(function(item) {
    return item == undefined ? emptyValue : item;
  });
});

// Find returns an array of values
const mapArrayValueResponse = (exports.mapArrayValueResponse = function mapArrayValueResponse(
  arrKeys,
  field,
  values
) {
  const _ref2 =
    arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const _ref2$emptyValue = _ref2.emptyValue;
  const emptyValue = _ref2$emptyValue === undefined ? null : _ref2$emptyValue;

  return arrKeys.map(function(keys) {
    return mapper("find", keys, field, values).map(function(item) {
      return item == undefined ? emptyValue : item;
    });
  });
});

// Filter returns an array
const mapArrayResponse = (exports.mapArrayResponse = function mapArrayResponse() {
  for (
    var _len = arguments.length, args = Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    args[_key] = arguments[_key];
  }

  return mapper.apply(undefined, ["filter"].concat(args, [[]]));
});

// Share logic between mapArray and mapValue
var mapper = function mapper(funcName, keys, field, values) {
  if (!Array.isArray(keys)) {
    throw "Keys must be an array";
  }

  if (typeof field !== "string") {
    throw "Field must be a string";
  }

  const splittedField = field.split(".");
  return keys.map(function(key) {
    return values[funcName](function(item) {
      return key == get(splittedField, item);
    });
  });
};

// Get the attributes from nested values
var get = function get(p, o) {
  return p.reduce(function(xs, x) {
    return xs && xs[x] ? xs[x] : null;
  }, o);
};

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Find returns an value
var mapValueResponse = exports.mapValueResponse = function mapValueResponse(keys, field, values) {
  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$emptyValue = _ref.emptyValue,
      emptyValue = _ref$emptyValue === undefined ? null : _ref$emptyValue;

  return mapper('find', keys, field, values).map(function (item) {
    return item == undefined ? emptyValue : item;
  });
};

// Filter returns an array
var mapArrayResponse = exports.mapArrayResponse = function mapArrayResponse() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return mapper.apply(undefined, ['filter'].concat(args, [[]]));
};

// Share logic between mapArray and mapValue
var mapper = function mapper(funcName, keys, field, values) {
  if (!Array.isArray(keys)) {
    throw 'Keys must be an array';
  }

  if (typeof field !== 'string') {
    throw 'Field must be a string';
  }

  var splittedField = field.split('.');
  return keys.map(function (key) {
    return values[funcName](function (item) {
      return key == get(splittedField, item);
    });
  });
};

// Get the attributes from nested values
var get = function get(p, o) {
  return p.reduce(function (xs, x) {
    return xs && xs[x] ? xs[x] : null;
  }, o);
};

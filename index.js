"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = require("react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// TODO: minlength, maxlength, match, ref, min, max

/**
 * Creates a model
 * @param {string} storeName - Store name, such as 'users'
 * @param {Object} schema - Schema for your model
 * - Example:
 * ```js
 * { name: { type: 'String', required: true },
 *    age: { type: 'Number', default: 18 } }
 * ```
 * @returns {Object} Model
 */
var useLocalMongo = function useLocalMongo(storeName) {
  var schema = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!storeName) throw new Error('Store Name is required');

  var _useState = (0, _react.useState)(window.localStorage.getItem(storeName)),
      _useState2 = _slicedToArray(_useState, 1),
      value = _useState2[0];

  var _useState3 = (0, _react.useState)(value ? JSON.parse(value) : []),
      _useState4 = _slicedToArray(_useState3, 2),
      documents = _useState4[0],
      setDocuments = _useState4[1];

  if (!value) {
    window.localStorage.setItem(storeName, '[]');
  }

  var validateEnum = function validateEnum(newValue, prop, storeName) {
    if (!schema[prop]["enum"].includes(newValue[prop])) return {
      error: "".concat(storeName, ": value: \"").concat(newValue[prop], "\" for property: \"").concat(prop, "\" doesn't pass the enum validation")
    };
  };

  var validateUniqueness = function validateUniqueness(newValue, prop, storeName) {
    if (documents.find(function (v) {
      return v[prop] === newValue[prop];
    })) {
      return {
        error: "".concat(storeName, ": document with value: \"").concat(newValue[prop], "\" for property \"").concat(prop, "\" already exists, it must be unique")
      };
    }
  };

  var validateRequired = function validateRequired(newValue, prop, storeName) {
    if (!newValue[prop]) return {
      error: "".concat(storeName, ": \"").concat(prop, "\" is required")
    };
  };

  var validateType = function validateType(newValue, prop, storeName) {
    if (newValue[prop].constructor.name !== schema[prop].type) return {
      error: "".concat(storeName, ": type of \"").concat(prop, "\" must be ").concat(schema[prop].type)
    };
  };

  var validate = function validate(newValue) {
    return new Promise(function (resolve, reject) {
      var filtered = {};
      Object.keys(schema).forEach(function (prop) {
        // checking "required"
        if (schema[prop].required === true) {
          var error = validateRequired(newValue, prop, storeName);
          if (error) return reject(error);
        } // checking "type"


        if (['String', 'Array', 'Boolean', 'Number', 'Object'].includes(schema[prop].type)) {
          var _error = validateType(newValue, prop, storeName);

          if (_error) return reject(_error);
        } // checking "unique"


        if (schema[prop].unique === true) {
          var _error2 = validateUniqueness(newValue, prop, storeName);

          if (_error2) return reject(_error2);
        } // checking "enum"


        if (Array.isArray(schema[prop]["enum"])) {
          var _error3 = validateEnum(newValue, prop, storeName);

          if (_error3) return reject(_error3);
        }

        if (!newValue[prop] && schema[prop]["default"]) {
          filtered[prop] = schema[prop]["default"];
        } else {
          filtered[prop] = newValue[prop];
        }
      });
      return resolve(filtered);
    });
  };

  var setLS = function setLS(newValue) {
    setDocuments(newValue);
    window.localStorage.setItem(storeName, JSON.stringify(newValue));
  };

  var genId = function genId() {
    return (Math.random() * Math.random()).toString().replace('.', '');
  };

  var genUniqueId = function genUniqueId() {
    var ids = documents.map(function (i) {
      return i._id;
    });

    var _id = genId();

    while (ids.includes(_id)) {
      _id = genId();
    }

    return _id;
  };

  var create = function create(newValue) {
    // If no schema:
    if (Object.keys(schema).length === 0) {
      var _id = genUniqueId();

      setLS([].concat(_toConsumableArray(documents), [_objectSpread(_objectSpread({}, newValue), {}, {
        _id: _id
      })]));
      return new Promise(function (resolve) {
        return resolve(_objectSpread(_objectSpread({}, newValue), {}, {
          _id: _id
        }));
      });
    } // If there is schema:


    return validate(newValue).then(function (filtered) {
      var _id = genUniqueId();

      setLS([].concat(_toConsumableArray(documents), [_objectSpread(_objectSpread({}, filtered), {}, {
        _id: _id
      })]));
      return Promise.resolve(_objectSpread(_objectSpread({}, filtered), {}, {
        _id: _id
      }));
    })["catch"](function (err) {
      return Promise.reject(err);
    });
  };
  /**
   * Updates a single document
   * @param {string} _id - _id of the document to be updated.
   * @param {Function} function - Return the updated version of the document in this function
   * - Example:
   * ```js
   * (user) => ({ ...user, name: 'New Name' })
   * ```
   */


  var findByIdAndUpdate = function findByIdAndUpdate(_id, cb) {
    return new Promise(function (res, rej) {
      var doc = documents.find(function (v) {
        return v._id === _id;
      });
      var updated = cb(doc);
      validate(updated).then(function (filtered) {
        setLS(documents.map(function (v) {
          return v._id !== _id ? v : _objectSpread(_objectSpread({}, filtered), {}, {
            _id: _id
          });
        }));
        return res(_objectSpread(_objectSpread({}, filtered), {}, {
          _id: _id
        }));
      })["catch"](function (err) {
        return rej(err);
      });
    });
  };
  /**
   * Deletes a single document
   * @param {string} _id - _id of the document to be deleted.
   */


  var findByIdAndDelete = function findByIdAndDelete(_id) {
    return new Promise(function (res, _rej) {
      setLS(documents.filter(function (v) {
        return v._id !== _id;
      }));
      return res('deleted');
    });
  };

  return {
    docs: documents,
    create: create,
    setDangerously: setLS,
    findByIdAndUpdate: findByIdAndUpdate,
    findByIdAndDelete: findByIdAndDelete
  };
};

var _default = useLocalMongo;
exports["default"] = _default;

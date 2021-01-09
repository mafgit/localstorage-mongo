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

// TODO: Enum, minlength, maxlength, match, ref

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

  var _useState = (0, _react.useState)(window.localStorage.getItem(storeName)),
      _useState2 = _slicedToArray(_useState, 1),
      value = _useState2[0];

  var _useState3 = (0, _react.useState)(value ? JSON.parse(value) : []),
      _useState4 = _slicedToArray(_useState3, 2),
      parsedValue = _useState4[0],
      setParsedValue = _useState4[1];

  if (!value) {
    window.localStorage.setItem(storeName, '[]');
  }

  var filterPropsAndCheckTypes = function filterPropsAndCheckTypes(newValue) {
    var filtered = {};
    var error;
    Object.keys(schema).forEach(function (prop) {
      if (!newValue[prop] && schema[prop].required === true) {
        error = new Error("".concat(storeName, ": \"").concat(prop, "\" is required"));
        return {
          error: error
        };
      }

      if (newValue[prop].constructor.name !== schema[prop].type) {
        error = Error("".concat(storeName, ": type of \"").concat(prop, "\" must be ").concat(schema[prop].type));
        return {
          error: error
        };
      } else if (!newValue[prop] && schema[prop]["default"]) {
        filtered[prop] = schema[prop]["default"];
      } else {
        filtered[prop] = newValue[prop];
      }
    });
    return {
      error: error,
      filtered: filtered
    };
  };

  var setLS = function setLS(newValue) {
    setParsedValue(newValue);
    window.localStorage.setItem(storeName, JSON.stringify(newValue));
  };

  var genId = function genId() {
    return (Math.random() * Math.random()).toString().replace('.', '');
  };

  var genUniqueId = function genUniqueId() {
    var ids = parsedValue.map(function (i) {
      return i._id;
    });

    var _id = genId();

    while (ids.includes(_id)) {
      _id = genId();
    }

    return _id;
  };

  var create = function create(newValue) {
    return new Promise(function (res, rej) {
      var _filterPropsAndCheckT = filterPropsAndCheckTypes(newValue),
          filtered = _filterPropsAndCheckT.filtered,
          error = _filterPropsAndCheckT.error;

      if (!error) {
        var _id = genUniqueId();

        setLS([].concat(_toConsumableArray(parsedValue), [_objectSpread(_objectSpread({}, filtered), {}, {
          _id: _id
        })]));
        return res(_objectSpread(_objectSpread({}, filtered), {}, {
          _id: _id
        }));
      } else {
        return rej(error);
      }
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
      var doc = parsedValue.find(function (v) {
        return v._id === _id;
      });
      var updated = cb(doc);

      var _filterPropsAndCheckT2 = filterPropsAndCheckTypes(updated),
          error = _filterPropsAndCheckT2.error,
          filtered = _filterPropsAndCheckT2.filtered;

      if (error) return rej(error);
      setLS(parsedValue.map(function (v) {
        return v._id !== _id ? v : _objectSpread(_objectSpread({}, filtered), {}, {
          _id: _id
        });
      }));
      return res(_objectSpread(_objectSpread({}, filtered), {}, {
        _id: _id
      }));
    });
  };
  /**
   * Deletes a single document
   * @param {string} _id - _id of the document to be deleted.
   */


  var findByIdAndDelete = function findByIdAndDelete(_id) {
    return new Promise(function (res, _rej) {
      setLS(parsedValue.filter(function (v) {
        return v._id !== _id;
      }));
      return res('deleted');
    });
  };

  return {
    value: parsedValue,
    create: create,
    setDangerously: setLS,
    findByIdAndUpdate: findByIdAndUpdate,
    findByIdAndDelete: findByIdAndDelete
  };
};

var _default = useLocalMongo;
exports["default"] = _default;

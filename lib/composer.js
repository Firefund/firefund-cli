"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compose = exports.composeListeners = undefined;

var _common = require("./common");

/** Compose functions that are all called with the same seed argument(s)
 * @param {function[]} listeners
 * @return {function}
 */
function composeListeners() {
  var listeners = [];
  listeners.push.apply(listeners, arguments);
  return function () {
    for (var i = 0, len = listeners.length; i < len; i++) {
      listeners[i].apply(listeners, arguments);
    }
  };
}

/** Compose functions that are called with the return value of the previous function
 * @param {function[]} f
 * @return {function}
 */
function compose() {
  var functions = [];
  functions.push.apply(functions, arguments);
  return function pass() {
    var ret = functions.shift().apply(undefined, arguments);
    if ((0, _common.isEmpty)(functions)) return ret;
    return pass(ret);
  };
}

exports.composeListeners = composeListeners;
exports.compose = compose;

"use strict";

/**
 * @param {function[]} listeners
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
function composer() {
  var listeners = [];
  listeners.push.apply(listeners, arguments);
  return function () {
    for (var i = 0, len = listeners.length; i < len; i++) {
      listeners[i].apply(listeners, arguments);
    }
  };
}

exports.default = composer;
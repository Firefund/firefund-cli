"use strict";

function composer() {
  var listeners = [];
  listeners.push.apply(listeners, arguments);
  return function () {
    for (var i = 0, len = listeners.length; i < len; i++) {
      listeners[i].apply(listeners, arguments);
    }
  };
}

module.exports = composer;
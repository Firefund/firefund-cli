"use strict"

/**
 * @param {function[]} listeners
 */
function composer(...listener) {
  let listeners = []
  listeners.push(...listener)
  return (...args) => {
    for(let i = 0, len = listeners.length; i < len; i++)
      listeners[i](...args)
  }
}

export default composer

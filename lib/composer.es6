"use strict"

import {isEmpty} from "./common"

/** Compose functions that are all called with the same seed argument(s)
 * @param {function[]} listeners
 * @return {function}
 */
function composeListeners(...listener) {
  const listeners = []
  listeners.push(...listener)
  return (...seed) => {
    for(let i = 0, len = listeners.length; i < len; i++)
      listeners[i](...seed)
  }
}

/** Compose functions that are called with the return value of the previous function
 * @param {function[]} f
 * @return {function}
 */
function compose(...f) {
  const functions = []
  functions.push(...f)
  return function pass(...args) {
    const ret = functions.shift()(...args)
    if(isEmpty(functions)) return ret
    return pass(ret)
  }
}

export {
  composeListeners,
  compose
}

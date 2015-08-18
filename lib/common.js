"use strict";

function errorOut(msg) {
  console.error(msg)
  process.exit(1);
}

function forEach(arr, fn) {
  for (var i = 0, len = arr.length; i < len; i++)
    fn(arr[i], i, arr);
}

function getParameters(get, paramenters) {
  var ret = [];

  forEach(paramenters, function(n, i, all) {
    if(n === get && all[i + 1])
      ret.push(all[i + 1])
  })
  return ret;
}

module.exports = {
  error: errorOut
, args: process.argv.slice(2).length > 0 ?
        process.argv.slice(2) : [null]
, fst: function(arr) { return arr.length > 0 ? arr[0] : [null] }
, snd: function(arr) { return arr.length > 1 ? arr[1] : [null]  }
, forEach: forEach
, getParameters: getParameters
}

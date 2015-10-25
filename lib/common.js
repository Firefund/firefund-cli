"use strict";

function errorOut(msg) {
  console.error(msg)
  process.exit(1);
}

function getParameters(get, parameters) {
  return parameters.map(
    (n, i, all) => { if(n === get && all[i + 1]) return all[i + 1] }
  ).filter(n => n)
}

module.exports = {
  error: errorOut
, args: process.argv.slice(2).length > 0 ?
        process.argv.slice(2) : [null]
, fst: function(arr) { return arr.length > 0 ? arr[0] : null }
, snd: function(arr) { return arr.length > 1 ? arr[1] : null  }
, getParameters: getParameters
}

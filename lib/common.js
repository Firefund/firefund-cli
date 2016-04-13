"use strict";

function errorOut(msg) {
  console.error(msg);
  process.exit(1);
}

function getParameters(get, parameters) {
  return parameters.map(function (n, i, all) {
    if (n === get && all[i + 1]) return all[i + 1];
  }).filter(function (n) {
    return n;
  });
}

module.exports = {
  errorOut: errorOut,
  args: process.argv.slice(2).length > 0 ? process.argv.slice(2) : [null],
  fst: function fst(arr) {
    return arr.length > 0 ? arr[0] : null;
  },
  snd: function snd(arr) {
    return arr.length > 1 ? arr[1] : null;
  },
  getParameters: getParameters
};
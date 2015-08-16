"use strict";

module.exports = {
  error: function errorOut(msg) {
    console.error(msg)
    process.exit(1);
  }
, args: process.argv.slice(2).length > 0 ?
        process.argv.slice(2) : [null]
, fst: function(arr) { return arr.length > 0 ? arr[0] : [null] }
, snd: function(arr) { return arr.length > 1 ? arr[1] : [null]  }
}

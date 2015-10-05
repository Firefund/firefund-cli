#!/usr/bin/env node

"use strict";

var c = require("../lib/common.js")
  , test = c.args

var useLibs = [];

c.forEach(test, function(n, i, all) {
  if(n === "-u" && all[i + 1])
    useLibs.push(all[i + 1])
})

console.log(useLibs)

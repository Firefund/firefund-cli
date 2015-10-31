#!/usr/bin/env node

"use strict";

var c = require("../lib/common.js")
  , args = c.args
  , shell = require("shelljs")

// direct arguments/paramenters to postcss + adding some default plugins
shell.exec("postcss -u autoprefixer -u lost -u cssnext" + args.join(" "))

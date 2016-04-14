#!/usr/bin/env node


"use strict";

var c = require("../lib/common.js"),
    args = c.args,
    shell = require("shelljs");

//TODO: find out where to put compiled css so that it works with kalei
//TODO: check for compiled css folder and create it if missing
//TODO: use shelljs to create a nodemon process that watches the develop css folder
//TODO: make css two build, one for prod and one for dev (no minifying)

// direct arguments/paramenters to postcss + adding some default plugins
shell.exec("postcss -u autoprefixer -u lost -u cssnext" + args.join(" "));
#!/usr/bin/env node

"use strict";

const c = require("../lib/common.js")
  , args = c.args
  , shell = require("shelljs")

//TODO: change the css command in firefund-cli to accept a directory and pass all the files to postcss
//TODO: check for compiled css folder and create it if missing
//TODO: use shelljs to create a nodemon process that watches the develop css folder
//TODO: make css two build, one for prod and one for dev (no minifying)

// direct arguments/paramenters to postcss + adding some default plugins
shell.exec("postcss --use lost --use postcss-cssnext " + args.join(" "))

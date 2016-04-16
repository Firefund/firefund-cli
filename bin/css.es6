#!/usr/bin/env node

"use strict";

const c = require("../lib/common.js")
  , args = c.args
  , shell = require("shelljs")

//TODO: change the css command in firefund-cli to accept a directory and pass all the files to postcss
const postcssInput = invert(args, concat(
  c.getParameters("-d", args),
  c.getParameters("--dir", args)
))
function invert(arr, selection) {
  return arr.filter(n => selection.indexOf(n) === -1)
}
function concat(arr1, arr2) {
  return arr1.push.apply(arr2)
}
/*console.warn("POSTCSSINPUT!!!!!!!!!!!!!!!!!!!!!")
console.warn(postcssInput)*/
//TODO: check for compiled css folder and create it if missing
//TODO: use shelljs to create a nodemon process that watches the develop css folder
//TODO: make css create two builds, one for prod and one for dev (no minifying)


// direct arguments/paramenters to postcss + adding some default plugins
shell.exec("postcss --use postcss-cssnext  --use lost" + args.join(" "))

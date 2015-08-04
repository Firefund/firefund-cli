#!/usr/bin/env node

var path = require("path");
var shell = require("shelljs")
var args = process.argv.slice(2)
var copyPath = path.resolve(__dirname, "../node_modules/.bin/bower-copy")

//shell.exec("echo " + args.toString())
console.log(copyPath + " -r " + path.resolve(process.cwd(), args[0]))

shell.exec(copyPath + " -r " + path.resolve(process.cwd(), args[0]));

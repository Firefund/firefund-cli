#!/usr/bin/env node


"use strict";

var _common = require("../lib/common.js");

var c = _interopRequireWildcard(_common);

var _path = require("path");

var path = _interopRequireWildcard(_path);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// import * as postcss from "postcss"
var args = c.args;

//TODO: change the css command in firefund-cli to accept a directory and pass all the files to postcss
// instead do: getParameters -o and get the last item from args
/*const postcssInput = reject(args, concat(
  c.getParameters("-d", args),
  c.getParameters("--dir", args)
))*/
function reject(arr, selection) {
  return arr.filter(function (n) {
    return selection.indexOf(n) === -1;
  });
}
function concat(arr1, arr2) {
  return [].concat(_toConsumableArray(arr1), _toConsumableArray(arr2));
}
/*console.warn("POSTCSSINPUT!!!!!!!!!!!!!!!!!!!!!")
console.warn(postcssInput)*/

//TODO: check for compiled css folder and create it if missing
//TODO: use shelljs to create a nodemon process that watches the develop css folder
//TODO: make css create two builds, one for prod and one for dev (no minifying)

// direct arguments/paramenters to postcss + adding some default plugins
// console.log( ["-u postcss-cssnext", "-u lost", ...args])
// console.log("cwd:", process.cwd())
var child = c.createChild({
  file: require.resolve("postcss-cli"),
  args: ["--use", "postcss-cssnext", "--use", "lost"].concat(_toConsumableArray(args)),
  stdio: ["ignore", "pipe", "pipe"]
});

// postcss([require("postcss-cssnext"), require("lost")]).process()
// shell.exec(path.normalize(`${process.execPath} ${require.resolve("postcss")} --use postcss-cssnext --use lost ${args.join(" ")}`))
// const execPostcssCommand = `${path.resolve("./node_modules/.bin/postcss")} --use postcss-cssnext --use lost ${args.join(" ")}`
// //console.warn(execPostcssCommand)
// shell.exec(execPostcssCommand, (error, stdout, stderr) => {
//   if(error !== null) console.log(`exec error: ${error}`)
//   console.log(`stdout: ${stdout}`);
//   console.log(`stderr: ${stderr}`);
// })
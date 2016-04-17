#!/usr/bin/env node


"use strict";

var _common = require("../lib/common.js");

var c = _interopRequireWildcard(_common);

var _shelljs = require("shelljs");

var shell = _interopRequireWildcard(_shelljs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var args = c.args;

//TODO: change the css command in firefund-cli to accept a directory and pass all the files to postcss
var postcssOutput = concat(concat(c.getParameters("-o", args), c.getParameters("--output", args)), concat(c.getParameters("-d", args), c.getParameters("--dir", args)));
var postcssInput = reject(args, postcssOutput.concat(["-o", "--output", "-d", "-dir"]));
if (isEmpty(postcssInput)) postcssInput.concat(args.slice(-1));

function concat(arr1, arr2) {
  return [].concat(_toConsumableArray(arr1), _toConsumableArray(arr2));
}
function isEmpty(array) {
  return array.length === 0;
}
function reject(arr, selection) {
  return arr.filter(function (n) {
    return selection.indexOf(n) === -1;
  });
}

console.warn(postcssInput);
console.warn(postcssOutput);

//TODO: check for output css folder and create it if missing
if (!shell.test("-e", c.fst(postcssOutput))) shell.mkdir("-p", postcssOutput);else if (!shell.test("-d", c.fst(postcssOutput))) throw new Error(c.fst(postcssOutput) + " is not a directory");
//TODO: use shelljs to create a nodemon process that watches the develop css folder
//TODO: make css create two builds, one for prod and one for dev (no minifying)

// direct arguments/paramenters to postcss + adding some default plugins
// console.log( ["-u postcss-cssnext", "-u lost", ...args])
// console.log("cwd:", process.cwd())
var child = c.createChild({
  file: require.resolve("postcss-cli"),
  args: ["--use", "postcss-cssnext", "--use", "lost"].concat(_toConsumableArray(args)),
  stdio: ["ignore", "pipe", "pipe"],
  pipes: [false, true, true]
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
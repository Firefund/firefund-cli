#!/usr/bin/env node


"use strict";

var _common = require("../lib/common.js");

var _common2 = _interopRequireDefault(_common);

var _child_process = require("child_process");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

require("leaked-handles");
// import shell from "shelljs"

// import * as postcss from "postcss"
var args = _common2.default.args;

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
function createChild(_ref) {
  var _ref$exec = _ref.exec;
  var // candidate for common.es6
  exec = _ref$exec === undefined ? process.execPath : _ref$exec;
  var file = _ref.file;
  var _ref$args = _ref.args;
  var args = _ref$args === undefined ? [] : _ref$args;
  var _ref$env = _ref.env;
  var env = _ref$env === undefined ? process.env : _ref$env;
  var _ref$stdio = _ref.stdio;
  var stdio = _ref$stdio === undefined ? ['ignore', 'ignore', 'ignore'] : _ref$stdio;

  var spawnArgs = [file].concat(_toConsumableArray(args)),
      // prepend file to args
  child = (0, _child_process.spawn)(exec, spawnArgs, { env: env, stdio: stdio }),
      fileDescriptorNames = ["stdin", "stdout", "stderr"];
  // console.log("spawnArgs", spawnArgs)

  //setEncoding to utf8 for stdio file descriptors that is set to pipe
  //to get a string instead of a bufffer when reading from them
  var fileDescriptors = fileDescriptorNames.map(function (fd, n) {
    return stdio[n] === "pipe" ? child[fd].setEncoding("utf8") : child[fd];
  });
  // console.dir(fileDescriptors)
  child.on("exit", function (code, signal) {
    fileDescriptors.forEach(function (fd) {
      if (fd !== null) fd.end("Closing the fd for you - YEAH!");
    });
  });

  return child;
}
// console.log( ["-u postcss-cssnext", "-u lost", ...args])
// console.log("cwd:", process.cwd())
var child = createChild({
  file: require.resolve("postcss-cli"),
  args: ["--use", "postcss-cssnext", "--use", "lost"].concat(_toConsumableArray(args)),
  stdio: ["ignore", "pipe", "pipe"]
});
child.stderr.pipe(process.stderr);
child.stdout.pipe(process.stdout);

// postcss([require("postcss-cssnext"), require("lost")]).process()
// shell.exec(path.normalize(`${process.execPath} ${require.resolve("postcss")} --use postcss-cssnext --use lost ${args.join(" ")}`))
// const execPostcssCommand = `${path.resolve("./node_modules/.bin/postcss")} --use postcss-cssnext --use lost ${args.join(" ")}`
// //console.warn(execPostcssCommand)
// shell.exec(execPostcssCommand, (error, stdout, stderr) => {
//   if(error !== null) console.log(`exec error: ${error}`)
//   console.log(`stdout: ${stdout}`);
//   console.log(`stderr: ${stderr}`);
// })
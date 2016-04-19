"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callPath = exports.postcssHandler = undefined;

var _common = require("../lib/common");

var _shelljs = require("shelljs");

var shell = _interopRequireWildcard(_shelljs);

var _events = require("events");

var _path = require("path");

var path = _interopRequireWildcard(_path);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.postcssHandler = postcssHandler;
exports.callPath = callPath;


var eventEmitter = new _events.EventEmitter();

function callPath(args) {
  var types = ["-r", "-d", "-o"];
  var alternatives = ["--replace", "--dir", "--output"];
  var callTypes = zip(types, alternatives).map(function (flags) {
    return flags.map(function (flag) {
      return (0, _common.getParameters)(flag);
    });
  }
  /*.map()
  .filter(x => x)*/
  );
  console.log(callTypes);
}
function zipWith(f, xs, ys) {
  if (isEmpty(xs || isEmpty(ys))) return [];
  var x = xs[0],
      y = ys[0];
  xs = xs.slice(1);
  ys = ys.slice(1);
  return [f(x, y)].concat(zipWith(f, xs, ys));
}
/* zip :: [a] -> [b] -> [(a, b)] */
function zip(a, b) {
  if (isEmpty(a || isEmpty(b))) return [];
  var x = a[0],
      y = b[0];
  return [[x, y]].concat(zip(a.slice(1), b.slice(1)));
}

function postcssHandler(args) {
  var postcssOutput = getOutputTarget(args);
  var postcssInput = getInputTarget(args, postcssOutput);

  //TODO: remove debug stuff
  console.warn(postcssInput);
  console.warn(postcssOutput);

  if (isEmpty(postcssOutput)) throw new TypeError("firefund-cli: output location is ommitted");

  postcssInput.forEach(function (input) {
    if (isDir(input)) transpileDir(input);else transpileFiles(input, (0, _common.fst)(postcssOutput), args);
  });

  return eventEmitter;
}
function getOutputTarget(args) {
  return concat(concat((0, _common.getParameters)("-o", args), (0, _common.getParameters)("--output", args)), concat((0, _common.getParameters)("-d", args), (0, _common.getParameters)("--dir", args)));
}
function getInputTarget(args, outputTarget) {
  var postcssInput = reject(args, outputTarget.concat(["-o", "--output", "-d", "-dir"]));
  if (isEmpty(postcssInput)) postcssInput.concat(args.slice(-1));
  return postcssInput;
}
function isDir(target) {
  return shell.test("-e", target) && shell.test("-d", target);
}
function transpileDir(target) {
  // check for output css folder and create it if missing
  createDir(target);
  // direct arguments/paramenters to postcss + adding some default plugins
  // console.log( ["-u postcss-cssnext", "-u lost", ...args])
  // console.log("cwd:", process.cwd())
  var child = (0, _common.createChild)({
    file: require.resolve("postcss-cli"),
    args: ["--use", "postcss-cssnext", "--use", "lost"].concat(_toConsumableArray(_common.args)),
    stdio: ["ignore", "pipe", "pipe"],
    pipes: [false, true, true]
  });
  child.on("exit", function () {
    eventEmitter.emit("sent");
  });
}
function transpileFiles(target, args) {
  createDir(target);
  // direct arguments/paramenters to postcss + adding some default plugins
  console.log(["-u postcss-cssnext", "-u lost"].concat(_toConsumableArray(args)));
  console.log("cwd:", process.cwd());
  var child = (0, _common.createChild)({
    file: require.resolve("postcss-cli"),
    args: ["--use", "postcss-cssnext", "--use", "lost"].concat(_toConsumableArray(args)),
    stdio: ["ignore", "pipe", "pipe"],
    pipes: [false, true, true]
  });
  child.on("exit", function () {
    eventEmitter.emit("sent");
  });
}

/**
 * utility functions
*/
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
function createDir(dirPath) {
  if (!shell.test("-d", dirPath)) shell.mkdir("-p", path.dirname(dirPath));
}

//else if(!shell.test("-d", fst(postcssOutput))) throw new Error(`firefund-cli: ${fst(postcssOutput)} is not a directory`)
//TODO: use shelljs to create a nodemon process that watches the develop css folder
//TODO: make css create two builds, one for prod and one for dev (no minifying)

// postcss([require("postcss-cssnext"), require("lost")]).process()
// shell.exec(path.normalize(`${process.execPath} ${require.resolve("postcss")} --use postcss-cssnext --use lost ${args.join(" ")}`))
// const execPostcssCommand = `${path.resolve("./node_modules/.bin/postcss")} --use postcss-cssnext --use lost ${args.join(" ")}`
// //console.warn(execPostcssCommand)
// shell.exec(execPostcssCommand, (error, stdout, stderr) => {
//   if(error !== null) console.log(`exec error: ${error}`)
//   console.log(`stdout: ${stdout}`);
//   console.log(`stderr: ${stderr}`);
// })

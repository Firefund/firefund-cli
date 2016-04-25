"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createChild = exports.isNotEmpty = exports.isEmpty = exports.getParameters = exports.snd = exports.fst = exports.args = exports.errorOut = undefined;

var _child_process = require("child_process");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var args = process.argv.length > 2 ? process.argv.slice(2) : [null];

function errorOut(msg) {
  console.error(msg);
  process.exit(1);
}

function fst(arr) {
  return arr.length > 0 ? arr[0] : null;
}

function snd(arr) {
  return arr.length > 1 ? arr[1] : null;
}

function getParameters(get, parameters) {
  return parameters.map(function (n, i, all) {
    if (n === get && all[i + 1]) return all[i + 1];
  }).filter(identity);
}

function identity(x) {
  return x;
}

function isEmpty(array) {
  return array.length === 0;
}
function isNotEmpty(array) {
  return !isEmpty(array);
}

/**
 * Spawn child process helper.
 * @param {object} _ref
 * @param  {string} _ref.exec       - path to executable, default: process.execPath
 * @param  {string} _ref.file       - path to file you want to execute with exec
 * @param  {string[]} _ref.args     - default: []
 * @param  {object} _ref.env        - default: process.execPath
 * @param  {string[]} _ref.stdio    - default: ["ignore", "ignore", "ignore"]
 * @param  {boolean[]} _ref.pipes   - default: [false, false, false]}
 * @param  {boolean[]} _ref.mutiple - NOT IMPLEMENTED determine how many process to create, default: 1
 * @return {child_process} A child process running your file
 */
function createChild(_ref) {
  var _ref$exec = _ref.exec;
  var exec = _ref$exec === undefined ? process.execPath : _ref$exec;
  var file = _ref.file;
  var _ref$args = _ref.args;
  var args = _ref$args === undefined ? [] : _ref$args;
  var _ref$env = _ref.env;
  var env = _ref$env === undefined ? process.env : _ref$env;
  var _ref$stdio = _ref.stdio;
  var stdio = _ref$stdio === undefined ? ["ignore", "ignore", "ignore"] : _ref$stdio;
  var _ref$pipes = _ref.pipes;
  var pipes = _ref$pipes === undefined ? [false, false, false] : _ref$pipes;
  var _ref$multiple = _ref.multiple;
  var multiple = _ref$multiple === undefined ? 1 : _ref$multiple;

  if (!file) throw new TypeError("path to the file you want to execute is omitted");

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

  // auto remove file descriptor if they are closed
  fileDescriptors.forEach(autoRemoveFileDescriptor);

  child.on("close", function (code, signal) {
    fileDescriptors.forEach(closeFileDescriptor);
  });

  //  for each true item in pipes,
  // auto pipe file descriptors to their corresponding process file descriptor
  fileDescriptors.forEach(pipeToProcess);

  return child;

  function autoRemoveFileDescriptor(fd, n, all) {
    if (fd === null) return;
    fd.on("close", function () {
      var indexOfFileDescriptor = all.indexOf(fd);
      if (indexOfFileDescriptor > -1) all[indexOfFileDescriptor] = null;
    });
  }
  function closeFileDescriptor(fd) {
    if (fd !== null && fd.destroyed === false) fd.destroy();
  }
  function pipeToProcess(fd, n) {
    if (fd !== null && pipes[n]) fd.pipe(process[fileDescriptorNames[n]]);
  }
}

exports.errorOut = errorOut;
exports.args = args;
exports.fst = fst;
exports.snd = snd;
exports.getParameters = getParameters;
exports.isEmpty = isEmpty;
exports.isNotEmpty = isNotEmpty;
exports.createChild = createChild;
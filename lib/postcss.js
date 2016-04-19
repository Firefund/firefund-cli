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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

exports.postcssHandler = postcssHandler;
exports.callPath = callPath;


var typeHandlers = [function Replace(output) {
  _classCallCheck(this, Replace);

  console.log("Replace", output);
}, function Directory(output) {
  _classCallCheck(this, Directory);

  console.log("Directory", output);
}, function File(output) {
  _classCallCheck(this, File);

  console.log("File", output);
}];

var eventEmitter = new _events.EventEmitter();

function callPath(parameters) {
  var types = ["-r", "-d", "-o"];
  var alternatives = ["--replace", "--dir", "--output"];
  /*const callTypes = zip(types, alternatives).map(
  		flags => 
  			flags
  				.map( flag => getParameters(flag, args) )
  				.filter( isNotEmpty )		
  	).map( (path, i, all) => path.length ? new typeHandlers[i](fst(path)) : null )*/
  var callTypes = convertPathsToObject(getPathFromParameters(parameters, searchWith(types, alternatives)), typeHandlers);

  console.log(callTypes);
}
/** searchWith :: [a] -> [b] -> [c] */
function searchWith(a, b) {
  return zip(a, b);
}
/** getPathForParameters :: (String a) => [a] -> [a] -> [a] */
function getPathFromParameters(parameters, search) {
  return search.map(function (searchKeys) {
    return searchKeys.map(function (s) {
      return (0, _common.getParameters)(s, parameters);
    }).filter(isNotEmpty);
  });
}
/** convertPathsToObject :: (String a) => [a] -> [b] -> [b] */
function convertPathsToObject(paths, classTuple) {
  return paths.map(function (path, i) {
    return isNotEmpty(path) && new classTuple[i]((0, _common.fst)(path));
  });
}
/* zipWith :: (a -> b -> c) -> [a] -> [b] -> [c] */
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
/** isNotEmpty :: [a] -> Bool */
function isNotEmpty(a) {
  return !isEmpty(a);
}
/** is element in array
 *  elem :: (Eq a) => a -> [a] -> Bool */
function elem(a, b) {
  if (b.length === 0) return false;
  var x = b[0];
  return a == x || elem(a, b.slice(1));
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
/** concat :: [a] -> [b] -> [(a,b)] */
function concat(arr1, arr2) {
  return [].concat(_toConsumableArray(arr1), _toConsumableArray(arr2));
}
/** isEmpty :: [a] -> Bool */
function isEmpty(array) {
  return array.length === 0;
}
/** reject :: [a] -> [b] -> [c] */
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

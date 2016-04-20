"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.File = exports.Directory = exports.Replace = exports.getTypeFromOption = exports.postcssHandler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require("../lib/common");

var _composer = require("../lib/composer");

var _shelljs = require("shelljs");

var shell = _interopRequireWildcard(_shelljs);

var _events = require("events");

var _path = require("path");

var path = _interopRequireWildcard(_path);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Replace = function () {
	function Replace(io) {
		_classCallCheck(this, Replace);

		// console.log("Replace", io)
		this.input = io.map(function (p) {
			return path.resolve(__dirname, p);
		});
	}

	_createClass(Replace, [{
		key: "validate",
		value: function validate() {
			this.input.forEach(function (input) {
				if (shell.test("-d", input)) throw new Error("Not implemented by postcss-clip");
			});
		}
	}]);

	return Replace;
}();

var Directory = function Directory(outp) {
	_classCallCheck(this, Directory);

	console.log("Directory", output);
};

var File = function File(output) {
	_classCallCheck(this, File);

	console.log("File", output);
};

exports.postcssHandler = postcssHandler;
exports.getTypeFromOption = getTypeFromOption;
exports.Replace = Replace;
exports.Directory = Directory;
exports.File = File;


var typeHandlers = [Replace, Directory, File];

var eventEmitter = new _events.EventEmitter();

function getTypeFromOption(parameters) {
	var types = ["-r", "-d", "-o"];
	var alternatives = ["--replace", "--dir", "--output"];
	/* First: procedural FP */
	/*const CallType = zip(types, alternatives).map(
 	flags => 
 		flags
 			.map( flag => getParameters(flag, parameters) )
 			.filter( isNotEmpty )		
 ).map( (path, i, all) => path.length ? typeHandlers[i].bind(null, fst(path)) : null )
 .filter(identity)*/

	/* Second: Convoluted FP */
	/*const CallType = convertPathsToObject(
 	typeHandlers,
 	getPathFromParameters(
 		parameters, searchWith(types, alternatives)
 	)		
 ).filter(identity)*/

	/* Third: composed FP */
	var getCallType = (0, _composer.compose)(searchWith, // the search criteria function
	callWith(getPathFromParameters, parameters), // get the path from the parameters
	callWith(convertPathsToObject, typeHandlers), // get the right instance of class(!)
	function (x) {
		return Array.prototype.filter.call(x, _common.identity);
	} // remove empty slots in the array
	);
	var CallType = getCallType(types, alternatives); // invoke the chain with the search criteria

	// console.log(new CallType[0])
	return CallType;
}
/** searchWith :: [a] -> [b] -> [c] */
function searchWith(a, b) {
	return zip(a, b);
}
/** callWith :: [a] -> [b] -> M(a) */
function callWith(fn) {
	for (var _len = arguments.length, a = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		a[_key - 1] = arguments[_key];
	}

	// it seems that a bug in babel scoping prevents us from using 'args' as named argument
	return fn.bind.apply(fn, [null].concat(a));
}
/** getPathForParameters :: (String a) => [a] -> [a] -> [a] */
function getPathFromParameters(parameters, search) {
	return search.map(function (searchKeys) {
		return searchKeys.map(function (s) {
			return (0, _common.getParameters)(s, parameters);
		}).filter(_common.isNotEmpty);
	});
}
/** convertPathsToObject :: (String a) => [a] -> [b] -> [b] */
function convertPathsToObject(classTuple, paths) {
	return paths.map(function (path, i) {
		return (0, _common.isNotEmpty)(path) && { // use Monad?
			class: classTuple[i],
			constructorArguments: (0, _common.fst)(path)
		};
	});
}
/* zipWith :: (a -> b -> c) -> [a] -> [b] -> [c] */
function zipWith(f, xs, ys) {
	if ((0, _common.isEmpty)(xs || (0, _common.isEmpty)(ys))) return [];
	var x = xs[0],
	    y = ys[0];
	xs = xs.slice(1);
	ys = ys.slice(1);
	return [f(x, y)].concat(zipWith(f, xs, ys));
}
/* zip :: [a] -> [b] -> [(a, b)] */
function zip(a, b) {
	if ((0, _common.isEmpty)(a || (0, _common.isEmpty)(b))) return [];
	var x = a[0],
	    y = b[0];
	return [[x, y]].concat(zip(a.slice(1), b.slice(1)));
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

	if ((0, _common.isEmpty)(postcssOutput)) throw new TypeError("firefund-cli: output location is ommitted");

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
	if ((0, _common.isEmpty)(postcssInput)) postcssInput.concat(args.slice(-1));
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

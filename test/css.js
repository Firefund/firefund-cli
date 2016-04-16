"use strict";

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _tap = require("tap");

var _tap2 = _interopRequireDefault(_tap);

var _common = require("../lib/common");

var _common2 = _interopRequireDefault(_common);

var _eol = require("eol");

var _eol2 = _interopRequireDefault(_eol);

var _shelljs = require("shelljs");

var _shelljs2 = _interopRequireDefault(_shelljs);

var _child_process = require("child_process");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function createChild(_ref) {
		var _ref$exec = _ref.exec;
		var exec = _ref$exec === undefined ? process.execPath : _ref$exec;
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
		    fileDescriptors = ["stdin", "stdout", "stderr"];

		//setEncoding to utf8 for stdio file descriptors that is set to pipe
		//to get a string instead of a bufffer when reading from them
		fileDescriptors.forEach(function (fd, n) {
				if (stdio[n] === "pipe") child[fd].setEncoding("utf8");
		});

		return child;
}

_tap2.default.test("css::transpile postcss file to css", function (t) {
		t.plan(1);

		var args = [_path2.default.resolve(__dirname, "./fixtures/folder1/postcss.css"), "-o", _path2.default.resolve(__dirname, "./test/temp.css")],
		    child = createChild({
				file: require.resolve("../bin/css.js"),
				args: args,
				stdio: ["ignore", "pipe", "pipe"]
		});

		child.stderr.on("data", function (msg) {
				return console.error(msg);
		});
		child.stdout.on("data", function (msg) {
				return console.warn(msg);
		});

		child.on('exit', function (code) {
				var filePath = _common2.default.snd(args),
				    actual = _shelljs2.default.test("-e", _path2.default.resolve(filePath)),
				    expected = true;
				// console.warn("CSS TEST COMMOND.SND!!!!", args, common.snd(args))
				t.equal(actual, expected, "test/temp.css should exist");

				// cleanup
				if (_shelljs2.default.test("-e", filePath)) _shelljs2.default.rm(filePath);

				t.end();
		});
});

_tap2.default.test("css::transpile directory to new location while keeping directory structure", function (t) {
		var actual = void 0,
		    expected = void 0;
		t.end();
});
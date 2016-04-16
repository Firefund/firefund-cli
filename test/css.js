"use strict";

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tap = require("tap");
var common = require("../lib/common");
var spawn = require("child_process").spawn;
var eol = require("eol");
var shell = require("shelljs");

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

		var spawnArgs = [file].concat.apply(args),
		    // prepend file to args
		child = spawn(exec, args, { env: env, stdio: stdio }),
		    fileDescriptors = ["stdin", "stdout", "stderr"];

		//setEncoding to utf8 for stdio file descriptors that is set to pipe
		//to get a string instead of a bufffer when reading from them
		fileDescriptors.forEach(function (fd, n) {
				if (stdio[n] === "pipe") child[fd].setEncoding("utf8");
		});

		return child;
}

tap.test("css::transpile postcss file to css", function (t) {
		t.plan(1);

		var args = ["fixtures/folder1/postcss.css", "-o test/temp.css"].map(function (p) {
				return _path2.default.join(__dirname, p);
		}),
		    child = createChild({
				file: "../bin/css.js",
				args: args,
				stdio: ['ignore', 'pipe', 'pipe']
		});

		child.stderr.on("data", function (msg) {
				return console.error(msg);
		});
		child.stdout.on("data", function (msg) {
				return console.warn(msg);
		});

		child.on('exit', function (code) {
				var filePath = common.snd(args),
				    actual = shell.test("-e", filePath),
				    expected = true;
				// console.warn("CSS TEST COMMOND.SND!!!!", args, common.snd(args))
				t.equal(actual, expected, "test/temp.css should exist");

				// cleanup
				if (shell.test("-e", filePath)) shell.rm(filePath);

				t.end();
		});
});

tap.test("css::transpile directory to new location while keeping directory structure", function (t) {
		var actual = void 0,
		    expected = void 0;
		t.end();
});
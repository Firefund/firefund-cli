"use strict";

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _tap = require("tap");

var _tap2 = _interopRequireDefault(_tap);

var _common = require("../lib/common");

var c = _interopRequireWildcard(_common);

var _eol = require("eol");

var _eol2 = _interopRequireDefault(_eol);

var _shelljs = require("shelljs");

var _shelljs2 = _interopRequireDefault(_shelljs);

var _child_process = require("child_process");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("leaked-handles");


_tap2.default.test("css::transpile postcss file to css", function (t) {
		t.plan(1);

		var args = [_path2.default.resolve(__dirname, "./fixtures/folder1/postcss.css"), "-o", _path2.default.resolve(__dirname, "./test/temp.css")],
		    child = c.createChild({
				file: require.resolve("../bin/css.js"),
				args: args,
				stdio: ["ignore", "pipe", "pipe"],
				pipes: [false, true, true]
		});

		child.on('exit', function (code) {
				var filePath = c.snd(args),
				    actual = _shelljs2.default.test("-e", _path2.default.resolve(filePath)),
				    expected = true;
				// console.warn("CSS TEST C.SND!!!!", args, c.snd(args))
				t.equal(actual, expected, "test/temp.css should exist");

				// cleanup
				if (_shelljs2.default.test("-e", filePath)) _shelljs2.default.rm(filePath), console.warn("deleting file!!!");

				t.end();
		});
});

_tap2.default.test("css::transpile directory to new location while keeping directory structure", function (t) {
		var actual = void 0,
		    expected = void 0;
		t.end();
});
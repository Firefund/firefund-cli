"use strict";

var _tap = require("tap");

var tap = _interopRequireWildcard(_tap);

var _postcss = require("../../lib/postcss");

var _postcss2 = _interopRequireDefault(_postcss);

var _path = require("path");

var path = _interopRequireWildcard(_path);

var _shelljs = require("shelljs");

var shell = _interopRequireWildcard(_shelljs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var INPUTFILE = path.resolve(__dirname, "../fixtures/folder1/postcss.css");

tap.test("css::transpile postcss file to css", function (t) {
	t.plan(1);

	var actual = void 0,
	    expected = void 0;

	var OUTPUTFILE = "postcss/unit.css";
	var COMPILEDFILE = "../fixtures/compiled.css";

	var postcssProcess = (0, _postcss2.default)(["-o", path.join(__dirname, OUTPUTFILE), INPUTFILE]);

	postcssProcess.on("sent", function (actual) {
		expected = shell.cat(COMPILEDFILE);
		actual = shell.cat(OUTPUTFILE);
		t.same(actual, expected, INPUTFILE + " should be the same as " + COMPILEDFILE);
		t.end();
	});
});
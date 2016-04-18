"use strict";

var _tap = require("tap");

var _tap2 = _interopRequireDefault(_tap);

var _common = require("../../lib/common");

var common = _interopRequireWildcard(_common);

var _eol = require("eol");

var _eol2 = _interopRequireDefault(_eol);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tap2.default.test("common.args", function (t) {
  var actual = void 0,
      expected = void 0;

  t.plan(3);

  expected = [null];
  actual = common.args;
  t.deepEqual(actual, expected, "there should be no arguments to this test");

  var child = common.createChild({
    file: "test/test/common.args.js",
    args: ["test/a/number", "of/arguments"],
    stdio: ['ignore', 'pipe', 'ignore']
  });

  child.on('exit', function (code) {
    var expected = "test/a/number@@of/arguments\n",
        actual = child.stdout.read();
    t.ok(code === 0, "should exit with NO error code (0)");
    t.equal(_eol2.default.lf(actual), expected, "should be two paths join together with @@");
    t.end();
  });
});

_tap2.default.test("common.errorOut()", function (t) {
  t.plan(2);

  var child = common.createChild({
    file: "test/test/common.errorOut.js",
    stdio: ['ignore', 'ignore', 'pipe']
  });

  child.on('exit', function (code) {
    var expected = "message\n",
        actual = child.stderr.read();

    t.ok(code === 1, "should exit with error code 1");
    t.equal(_eol2.default.lf(actual), expected, "should have 'message' in stderr");
    t.end();
  });
});
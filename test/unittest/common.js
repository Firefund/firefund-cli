"use strict";

var _tap = require("tap");

var _tap2 = _interopRequireDefault(_tap);

var _common = require("../../lib/common");

var common = _interopRequireWildcard(_common);

var _eol = require("eol");

var _eol2 = _interopRequireDefault(_eol);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tap2.default.test("common.fst()", function (t) {
  var actual = void 0,
      expected = void 0;

  t.plan(2);

  expected = null;
  actual = common.fst([]);
  t.ok(actual === expected, "an empty array should return null");

  expected = 1;
  actual = common.fst([1, 2, 3]);
  t.ok(actual === expected, "[1,2,3] should return 1");

  t.end();
});

_tap2.default.test("common.snd()", function (t) {
  var actual = void 0,
      expected = void 0;

  t.plan(2);

  expected = null;
  actual = common.snd([]);
  t.ok(actual === expected, "[] should return null");

  expected = 2;
  actual = common.snd([1, 2, 3]);
  t.ok(actual === expected, "[1,2,3] should return 2");

  t.end();
});

_tap2.default.test("common.getParameters()", function (t) {
  var actual = void 0,
      expected = void 0;

  t.plan(2);

  expected = [2];
  actual = common.getParameters("--two", ["--one", 1, "--two", 2]);
  t.similar(actual, expected, "[\"--two\", \"--one\", 1, \"--two\", 2] should return [2]");

  expected = [2, 2];
  actual = common.getParameters("--two", ["--one", 1, "--two", 2, "--two", 2]);
  t.similar(actual, expected, "[\"--two\", \"--one\", 1, \"--two\", 2] should return [2,2]");

  t.end();
});
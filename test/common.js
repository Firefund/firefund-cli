"use strict";

var tap = require("tap");
var common = require("../lib/common");
var spawn = require("child_process").spawn;
var eol = require("eol");

tap.test("common.args", function (t) {
  var actual, expected;
  var args = common.args;

  t.plan(1);

  expected = null;
  actual = args[0];
  t.ok(actual === expected, "there should be no arguments to this test");

  t.end();
});

tap.test("common.fst()", function (t) {
  var actual, expected;

  t.plan(2);

  expected = null;
  actual = common.fst([]);
  t.ok(actual === expected, "an empty array should return null");

  expected = 1;
  actual = common.fst([1, 2, 3]);
  t.ok(actual === expected, "[1,2,3] should return 1");

  t.end();
});

tap.test("common.snd()", function (t) {
  var actual, expected;

  t.plan(2);

  expected = null;
  actual = common.snd([]);
  t.ok(actual === expected, "[] should return null");

  expected = 2;
  actual = common.snd([1, 2, 3]);
  t.ok(actual === expected, "[1,2,3] should return 2");

  t.end();
});

tap.test("common.getParameters()", function (t) {
  var actual, expected;

  t.plan(2);

  expected = [2];
  actual = common.getParameters("--two", ["--one", 1, "--two", 2]);
  t.similar(actual, expected, "[\"--two\", \"--one\", 1, \"--two\", 2] should return [2]");

  expected = [2, 2];
  actual = common.getParameters("--two", ["--one", 1, "--two", 2, "--two", 2]);
  t.similar(actual, expected, "[\"--two\", \"--one\", 1, \"--two\", 2] should return [2,2]");

  t.end();
});
tap.test("common.errorOut()", function (t) {
  var actual, expected;
  var env = process.env,
      args = ["test/test/common.errorOut.es6"],
      node = process.execPath;
  var child = spawn(node, args, {
    env: env,
    stdio: ['ignore', 'ignore', 'pipe']
  });

  t.plan(2);

  child.stderr.setEncoding("utf8");

  child.on('exit', function (code) {
    t.ok(code === 1, "should exit with error code 1");
    t.equal(eol.lf(child.stderr.read()), "message\n");
    t.end();
  });
});
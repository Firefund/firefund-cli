"use strict";

var tap = require("tap");
var common = require("../lib/common");
var spawn = require("child_process").spawn;
var eol = require("eol");

function createChild(_ref) {
  var _ref$exec = _ref.exec;
  var exec = _ref$exec === undefined ? process.execPath : _ref$exec;
  var file = _ref.file;
  var _ref$args = _ref.args;
  var args = _ref$args === undefined ? [] : _ref$args;
  var _ref$env = _ref.env;
  var env = _ref$env === undefined ? process.env : _ref$env;
  var stdio = _ref.stdio;

  args.unshift(file); // prepend file to args
  var child = spawn(exec, args, { env: env, stdio: stdio }),
      fileDescriptors = ["stdin", "stdout", "stderr"];

  //setEncoding to utf8 for stdio file descriptors that is set to pipe
  //to get a string instead of a bufffer when reading from them
  fileDescriptors.forEach(function (fd, n) {
    if (stdio[n] === "pipe") child[fd].setEncoding("utf8");
  });

  return child;
}

tap.test("common.args", function (t) {
  var actual = void 0,
      expected = void 0;

  t.plan(3);

  expected = [null];
  actual = common.args;
  t.deepEqual(actual, expected, "there should be no arguments to this test");

  var child = createChild({
    file: "test/test/common.args.js",
    args: ["test/a/number", "of/arguments"],
    stdio: ['ignore', 'pipe', 'ignore']
  });

  child.on('exit', function (code) {
    var expected = "test/a/number@@of/arguments\n",
        actual = child.stdout.read();
    t.ok(code === 0, "should exit with NO error code (0)");
    t.equal(eol.lf(actual), expected, "should be two paths join together with @@");
    t.end();
  });
});

tap.test("common.fst()", function (t) {
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

tap.test("common.snd()", function (t) {
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

tap.test("common.getParameters()", function (t) {
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

tap.test("common.errorOut()", function (t) {
  t.plan(2);

  var child = createChild({
    file: "test/test/common.errorOut.js",
    stdio: ['ignore', 'ignore', 'pipe']
  });

  child.on('exit', function (code) {
    var expected = "message\n",
        actual = child.stderr.read();

    t.ok(code === 1, "should exit with error code 1");
    t.equal(eol.lf(actual), expected, "should have 'message' in stderr");
    t.end();
  });
});
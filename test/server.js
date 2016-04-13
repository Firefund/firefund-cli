"use strict";

var _tap = require("tap");

var _tap2 = _interopRequireDefault(_tap);

var _eol = require("eol");

var _eol2 = _interopRequireDefault(_eol);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spawn = require("child_process").spawn;
var nodejs = process.execPath;

function createChild(_ref) {
  var args = _ref.args;
  var env = _ref.env;
  var stdio = _ref.stdio;

  return spawn(nodejs, args, { env: env, stdio: stdio });
}
function timer(fn) {
  return setTimeout(fn, 100);
}
function kill(child) {
  child.kill("SIGTERM");
}

_tap2.default.test("server.es6::missing first argument", function (t) {
  var env = process.env;
  var args = [require.resolve("../bin/server")],
      child = createChild({ args: args, env: env, stdio: ["ignore", "ignore", "pipe"] }),
      timerId = void 0,
      errorOutput = "",
      childKiller = kill.bind(null, child);

  t.plan(2);

  child.stderr.setEncoding("utf8");
  child.on('exit', function (code) {
    t.ok(code === 1, "should exit with error code 1");
    t.equal(_eol2.default.lf(errorOutput), "Root path for ecstatic is required as first argument\n");
    t.end();
  });
  child.stderr.on("data", function (chunk) {
    if (timerId) clearTimeout(timerId);
    errorOutput += chunk;
    timerId = timer(childKiller);
  });
});

_tap2.default.test("server.es6::missing second argument", function (t) {
  var env = process.env,
      server = require.resolve("../bin/server");
  var args = [server, "test/fixtures"],
      child = createChild({ args: args, env: env, stdio: ["ignore", "ignore", "pipe"] }),
      timerId = void 0,
      errorOutput = "",
      childKiller = kill.bind(null, child);

  t.plan(2);

  child.stderr.setEncoding("utf8");
  child.on('exit', function (code) {
    t.ok(code === 1, "should exit with error code 1");
    t.equal(_eol2.default.lf(errorOutput), "Watch path for livereload is required as second argument\n");
    t.end();
  });
  child.stderr.on("data", function (chunk) {
    if (timerId) clearTimeout(timerId);
    errorOutput += chunk;
    timerId = timer(childKiller);
  });
});

_tap2.default.test("server.es6::Ecstatic startup message", function (t) {
  var env = process.env,
      server = require.resolve("../bin/server"),
      args = [server, "test/fixtures", "test/fixtures"],
      stdio = "pipe",
      child = createChild({ env: env, args: args, stdio: stdio });
  var output = "",
      expectedOutput = "Running server on port http://localhost:8080 with root in test/fixtures and listening for changes in test/fixtures\n";

  t.plan(2);

  child.stdin.setEncoding("utf8");
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");

  child.on('exit', function (code) {
    t.ok((code | 0) === 0, "should exit with error code 0");
    /*console.log( "stderr says:", child.stderr.read() )
    console.log( "stdout says:", child.stdout.read(), output )
    console.log( "stdin says:", child.stdin.read() )*/
    t.equal(_eol2.default.lf(output), expectedOutput);
  });
  child.stdout.on("data", function (chunk) {
    output += chunk;
  });

  setTimeout(function () {
    child.kill("SIGTERM");
  }, 1000);
});
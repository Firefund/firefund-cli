"use strict";

var _tap = require("tap");

var tap = _interopRequireWildcard(_tap);

var _eol = require("eol");

var eol = _interopRequireWildcard(_eol);

var _path = require("path");

var path = _interopRequireWildcard(_path);

var _fs = require("fs");

var fs = _interopRequireWildcard(_fs);

var _common = require("../lib/common");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function timer(fn) {
  return setTimeout(fn, 100);
}
function kill(child) {
  child.kill("SIGTERM");
}

tap.test("server.es6::missing first argument", function (t) {
  var child = (0, _common.createChild)({
    file: require.resolve("../bin/server"),
    stdio: ["ignore", "ignore", "pipe"]
  }),
      timerId = void 0,
      errorOutput = "",
      childKiller = kill.bind(null, child);

  t.plan(2);

  child.on('exit', function (code) {
    t.ok(code === 1, "should exit with error code 1");
    t.equal(eol.lf(errorOutput), "Root path for ecstatic is required as first argument\n");
    t.end();
  });
  child.stderr.on("data", function (chunk) {
    if (timerId) clearTimeout(timerId);
    errorOutput += chunk;
    timerId = timer(childKiller);
  });
});

tap.test("server.es6::missing second argument", function (t) {
  var child = (0, _common.createChild)({
    file: require.resolve("../bin/server"),
    args: ["test/fixtures"],
    stdio: ["ignore", "ignore", "pipe"]
  }),
      childKiller = kill.bind(null, child);

  var timerId = void 0,
      errorOutput = "";

  t.plan(2);

  child.on('exit', function (code) {
    t.ok(code === 1, "should exit with error code 1");
    t.equal(eol.lf(errorOutput), "Watch path for livereload is required as second argument\n");
    t.end();
  });
  child.stderr.on("data", function (chunk) {
    if (timerId) clearTimeout(timerId);
    errorOutput += chunk;
    timerId = timer(childKiller);
  });
});

tap.test("server.es6::Ecstatic startup message", function (t) {
  var child = (0, _common.createChild)({
    file: require.resolve("../bin/server"),
    args: ["test/fixtures", "test/fixtures"],
    stdio: ["ignore", "pipe", "ignore"]
  }),
      expectedOutput = "Running ecstatic on http://localhost:8080 and livereload on http://localhost:8081 with root in test/fixtures and listening for changes in test/fixtures\n",
      childKiller = kill.bind(null, child);

  var timerId = void 0,
      output = "";

  t.plan(2);

  child.on('exit', function (code) {
    t.ok((code | 0) === 0, "should exit with error code 0");
    t.equal(eol.lf(output), expectedOutput);
  });
  child.stdout.on("data", function (chunk) {
    if (timerId) clearTimeout(timerId);
    output += chunk;
    timerId = timer(childKiller);
  });
});

tap.test("server.es6::Run multiple instances of ecstatic", function (t) {
  t.plan(2);

  var port = ["-p", 8888];
  var file = require.resolve("../bin/server");
  var args = ["test/fixtures", "test/fixtures"];
  var stdio = ["ignore", "pipe", "pipe"];

  var child = (0, _common.createChild)({ file: file, args: args.concat(port), stdio: stdio });
  var childKiller1 = kill.bind(null, child);
  child.stderr.on("data", function (data) {
    childKiller1();
    t.fail("server.es6 threw an error: " + data);
  });
  child.stdout.on("data", function (data) {
    t.ok(true, data);
    childKiller1();
  });

  port = ["--port", 8989];
  child = (0, _common.createChild)({ file: file, args: args.concat(port), stdio: stdio });
  var childKiller2 = kill.bind(null, child);
  child.stderr.on("data", function (data) {
    childKiller2();
    t.fail("server.es6 threw an error: " + data);
  });
  child.stdout.on("data", function (data) {
    t.ok(true, data);
    childKiller2();
  });

  // let timerId

  // t.plan(2)

  // child.on('exit', code => {
  //   t.ok((code|0) === 0, "should exit with error code 0")
  //   t.equal( eol.lf( output ), expectedOutput )
  // })
  // child.stdout.on("data", (chunk) => {
  //   if(timerId)
  //     clearTimeout(timerId)
  //   output += chunk
  //   timerId = timer(childKiller)
  // })
});
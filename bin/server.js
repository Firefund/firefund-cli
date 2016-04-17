#!/usr/bin/env node


"use strict";

/* *******************************************************************
 * REMEMBER ONLY REQUIRE ES5 CODE AS NODE STILL DOES NOT SUPPORT ES6 *
 ******************************************************************* */

var _common = require("../lib/common");

var c = _interopRequireWildcard(_common);

var _composer = require("../lib/composer");

var _composer2 = _interopRequireDefault(_composer);

var _path = require("path");

var path = _interopRequireWildcard(_path);

var _ecstatic = require("ecstatic");

var _ecstatic2 = _interopRequireDefault(_ecstatic);

var _livereload = require("livereload");

var livereload = _interopRequireWildcard(_livereload);

var _http = require("http");

var http = _interopRequireWildcard(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var rootPath = c.fst(c.args),
    watchPath = c.snd(c.args) // null or second argument to server
,
    dirroot = path.normalize(process.cwd()),
    server = livereload.createServer({ exts: ["htm", "html", "css", "js", "png", "gif", "jpg", "svg"] });

if (!rootPath) c.errorOut("Root path for ecstatic is required as first argument");

if (!watchPath) c.errorOut("Watch path for livereload is required as second argument");

var listeners = (0, _composer2.default)(logPath, setupEcstatic());
http.createServer(listeners).listen(8080);

server.watch(path.resolve(dirroot, watchPath));

function logPath(request, response) {
  console.log("[" + new Date(Date.now()).toLocaleString() + "]\t" + request.method + " request for " + request.url);
}

function setupEcstatic() {
  return (0, _ecstatic2.default)({
    root: path.resolve(dirroot, rootPath),
    defaultExt: "htm"
  });
}

console.log("Running server on port http://localhost:8080 with root in %s and listening for changes in %s", rootPath, watchPath);
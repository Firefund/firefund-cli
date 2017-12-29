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

// ecstatic exports in a very unusual way
var getPort = function getPort(args) {
  var p = c.getParameters("-p", args);
  var port = c.getParameters("--port", args);
  return c.isNotEmpty(p) && c.fst(p) || c.isNotEmpty(port) && c.fst(port) || null;
};

var port = getPort(c.args) | 0;
// console.error("PORT", c.args, c.args.indexOf(port))
if (port) c.args.splice(c.args.indexOf(port) - 1, 2);else port = 8080;
// console.error("PORT", c.args)

var rootPath = c.fst(c.args);
var watchPath = c.snd(c.args); // null or second argument to server
var dirroot = path.normalize(process.cwd());
var server = livereload.createServer({ port: port + 1, exts: ["htm", "html", "css", "js", "png", "gif", "jpg", "svg"] });

if (!rootPath) c.errorOut("Root path for ecstatic is required as first argument");

if (!watchPath) c.errorOut("Watch path for livereload is required as second argument");

var middleware = (0, _composer2.default)(logPath, setupEcstatic());
http.createServer(middleware).listen(port);

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

console.log("Running ecstatic on http://localhost:" + port + " and livereload on http://localhost:" + (port + 1) + " with root in " + rootPath + " and listening for changes in " + watchPath);
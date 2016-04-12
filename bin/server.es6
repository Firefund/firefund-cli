#!/usr/bin/env node

"use strict";

/* *******************************************************************
 * REMEMBER ONLY REQUIRE ES5 CODE AS NODE STILL DOES NOT SUPPORT ES6 *
 ******************************************************************* */

const c = require("../lib/common")
  , rootPath = c.fst(c.args)
  , watchPath = c.snd(c.args) // null or second argument to server
  , path = require("path")
  , ecstatic = require("ecstatic")
  , livereload = require("livereload")
  , http = require("http")
  , dirroot = path.normalize(process.cwd())
  , server = livereload.createServer({ exts: ["htm", "html", "css", "js", "png", "gif", "jpg", "svg"] })
  , composeListeners = require("../lib/composer")

if(!rootPath)
  c.errorOut("Root path for ecstatic is required as first argument")

if(!watchPath)
  c.errorOut("Watch path for livereload is required as second argument")

let listeners = composeListeners(logPath, setupEcstatic())
http.createServer(listeners).listen(8080);

server.watch(path.resolve(dirroot, watchPath))

function logPath(request, response) {
  console.log(request.url)
}

function setupEcstatic() {
  return ecstatic({
    root: path.resolve(dirroot, rootPath),
    defaultExt: "htm"
  })
}

console.log(
  "Running server on port http://localhost:8080 with root in %s and listening for changes in %s",
  rootPath, watchPath
)

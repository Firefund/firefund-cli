#!/usr/bin/env node

"use strict";

var c = require("../lib.es5/common")
  , watchPath = c.fst(c.args) // null or first argument to server
  , path = require("path")
  , ecstatic = require("ecstatic")
  , livereload = require("livereload")
  , http = require("http")
  , dirroot = path.normalize(process.cwd())
  , server = livereload.createServer()
  , workingDir = path.resolve(dirroot, watchPath)
  , composeListeners = require("../lib.es5/composer")

if(!watchPath) {
  c.error("Watch path for livereload is required!")
}

let listeners = composeListeners(logPath, setupEcstatic())
http.createServer(listeners).listen(8080);

server.watch(path.resolve(dirroot, watchPath));

function logPath(request, response) {
  console.log(request.url)
}

function setupEcstatic() {
  return ecstatic({
    root: path.resolve(dirroot, watchPath),
    defaultExt: "htm"
  })
}

console.log(
  "Running server on port http://localhost:8080 with root in %s and listening for changes in %s",
  workingDir, workingDir
)

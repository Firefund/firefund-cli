#!/usr/bin/env node

"use strict";

var c = require("../lib/common.js")
  , watchPath = c.fst(c.args) // null or first argument to server
  , path = require("path")
  , ecstatic = require("ecstatic")
  , livereload = require("livereload")
  , http = require("http")
  , dirroot = path.normalize(process.cwd())
  , server = livereload.createServer()
  , workingDir = path.resolve(dirroot, watchPath)

if(!watchPath) {
  c.error("Watch path for livereload is required!")
}

http.createServer(
  ecstatic({
    root: path.resolve(dirroot, watchPath),
    defaultExt: "htm"
  })
).listen(8080);

server.watch(path.resolve(dirroot, watchPath));

console.log(
  "Running server on port http://localhost:8080 with root in %s and listening for changes in %s",
  workingDir, workingDir
)

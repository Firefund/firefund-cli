#!/usr/bin/env node

"use strict";

var c = require("../lib/common.js")
  , path = require("path");
  , shell = require("shelljs")
  , args = process.argv.slice(2)
  , ecstatic = require("ecstatic")
  , livereload = require("livereload")
  , path = require("path")
  , http = require("http")
  , dirroot = path.normalize(process.cwd())
  , server = livereload.createServer()

if(!args[0]) {
  c.error("Watch path for livereload is required!")
}

http.createServer(
  ecstatic({ root: dirroot + "/frontend/" })
).listen(8080);

server.watch(dirroot + args[0]);

console.log(
  "Running server on port localhost:8080 and watching changes in "
  + dirroot + args[0]
)

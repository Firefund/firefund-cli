#!/usr/bin/env node

"use strict";

/* *******************************************************************
 * REMEMBER ONLY REQUIRE ES5 CODE AS NODE STILL DOES NOT SUPPORT ES6 *
 ******************************************************************* */

import * as c from "../lib/common"
import {composeListeners} from "../lib/composer"
import * as path from "path"
import ecstatic from "ecstatic" // ecstatic exports in a very unusual way
import * as livereload from "livereload"
import * as http from "http"

const rootPath = c.fst(c.args)
    , watchPath = c.snd(c.args) // null or second argument to server
    , dirroot = path.normalize(process.cwd())
    , server = livereload.createServer({ exts: ["htm", "html", "css", "js", "png", "gif", "jpg", "svg"] })

if(!rootPath)
  c.errorOut("Root path for ecstatic is required as first argument")

if(!watchPath)
  c.errorOut("Watch path for livereload is required as second argument")

const listeners = composeListeners(logPath, setupEcstatic())
http.createServer(listeners).listen(8080);

server.watch(path.resolve(dirroot, watchPath))

function logPath(request, response) {
  console.log(`[${new Date(Date.now()).toLocaleString()}]\t${request.method} request for ${request.url}`)
}

function setupEcstatic() {
  return ecstatic({
    root: path.resolve(dirroot, rootPath),
    defaultExt: "htm"
  })
}

console.log(
  `Running server on port http://localhost:8080 with root in ${rootPath} and listening for changes in ${watchPath}`
)

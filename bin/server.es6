#!/usr/bin/env node

"use strict";

/* *******************************************************************
 * REMEMBER ONLY REQUIRE ES5 CODE AS NODE STILL DOES NOT SUPPORT ES6 *
 ******************************************************************* */

import * as c from "../lib/common"
import composeMiddleware from "../lib/composer"
import * as path from "path"
import ecstatic from "ecstatic" // ecstatic exports in a very unusual way
import * as livereload from "livereload"
import * as http from "http"

const getPort = (args) => {
  const p = c.getParameters("-p", args)
  const port = c.getParameters("--port", args)
  return c.isNotEmpty(p) && c.fst(p) || c.isNotEmpty(port) && c.fst(port) || null
}

let port = getPort(c.args)|0
// console.error("PORT", c.args, c.args.indexOf(port))
if(port) c.args.splice( c.args.indexOf(port) - 1, 2 )
else port = 8080
// console.error("PORT", c.args)

const rootPath = c.fst(c.args)
const watchPath = c.snd(c.args) // null or second argument to server
const dirroot = path.normalize(process.cwd())
const server = livereload.createServer({ port: port + 1, exts: ["htm", "html", "css", "js", "png", "gif", "jpg", "svg"] })

if(!rootPath)
  c.errorOut("Root path for ecstatic is required as first argument")

if(!watchPath)
  c.errorOut("Watch path for livereload is required as second argument")

const middleware = composeMiddleware(logPath, setupEcstatic())
http.createServer(middleware).listen(port)

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

console.log(`Running ecstatic on http://localhost:${port} and livereload on http://localhost:${port+1} with root in ${rootPath} and listening for changes in ${watchPath}`)

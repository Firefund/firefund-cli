"use strict";

import tap from "tap"
import eol from "eol"
import path from "path"
import fs from "fs"
const spawn = require("child_process").spawn
const nodejs = process.execPath

function createChild({ args, env, stdio }) {
  return spawn(nodejs, args, { env, stdio })
}
function timer(fn) {
  return setTimeout(fn, 100)
}
function kill(child) {
  child.kill("SIGTERM")
}

tap.test("server.es6::missing first argument", function(t) {
  const env = process.env
  let args = [require.resolve("../bin/server")],
      child = createChild({ args, env, stdio: ["ignore", "ignore", "pipe"] }),
      timerId,
      errorOutput = "",
      childKiller = kill.bind(null, child)

  t.plan(2)

  child.stderr.setEncoding("utf8")
  child.on('exit', code => {
    t.ok(code === 1, "should exit with error code 1")
    t.equal( eol.lf( errorOutput ), "Root path for ecstatic is required as first argument\n" )
    t.end()
  })
  child.stderr.on("data", (chunk) => {
    if(timerId)
      clearTimeout(timerId)
    errorOutput += chunk
    timerId = timer(childKiller)
  })
})

tap.test("server.es6::missing second argument", function(t) {
  const env = process.env,
        server = require.resolve("../bin/server")
  let args = [server, "test/fixtures"],
      child = createChild({ args, env, stdio: ["ignore", "ignore", "pipe"] }),
      timerId,
      errorOutput = "",
      childKiller = kill.bind(null, child)

  t.plan(2)

  child.stderr.setEncoding("utf8")
  child.on('exit', code => {
    t.ok(code === 1, "should exit with error code 1")
    t.equal( eol.lf( errorOutput ), "Watch path for livereload is required as second argument\n" )
    t.end()
  })
  child.stderr.on("data", (chunk) => {
    if(timerId)
      clearTimeout(timerId)
    errorOutput += chunk
    timerId = timer(childKiller)
  })
})

tap.test("server.es6::Ecstatic startup message", function(t) {
  const env = process.env,
        server = require.resolve("../bin/server"),
        args = [server, "test/fixtures", "test/fixtures"],
        stdio = "pipe",
        child = createChild({ env, args, stdio })
  let output = "",
      expectedOutput = "Running server on port http://localhost:8080 with root in test/fixtures and listening for changes in test/fixtures\n"

  t.plan(2)

  child.stdin.setEncoding("utf8")
  child.stdout.setEncoding("utf8")
  child.stderr.setEncoding("utf8")

  child.on('exit', code => {
    t.ok((code|0) === 0, "should exit with error code 0")
    /*console.log( "stderr says:", child.stderr.read() )
    console.log( "stdout says:", child.stdout.read(), output )
    console.log( "stdin says:", child.stdin.read() )*/
    t.equal( eol.lf( output ), expectedOutput )
  })
  child.stdout.on("data", (chunk) => {
    output += chunk
  })

  setTimeout(() => {
    child.kill("SIGTERM")
  }, 1000)
})

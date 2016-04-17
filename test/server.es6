"use strict";

import * as tap from "tap"
import * as eol from "eol"
import * as path from "path"
import * as fs from "fs"
import {createChild} from "../lib/common"


function timer(fn) {
  return setTimeout(fn, 100)
}
function kill(child) {
  child.kill("SIGTERM")
}

tap.test("server.es6::missing first argument", function(t) {
  let child = createChild({
    file: require.resolve("../bin/server"),
    stdio: ["ignore", "ignore", "pipe"]
  }),
      timerId,
      errorOutput = "",
      childKiller = kill.bind(null, child)

  t.plan(2)

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
  const child = createChild({
          file: require.resolve("../bin/server"),
          args: ["test/fixtures"],
          stdio: ["ignore", "ignore", "pipe"]
        }),
        childKiller = kill.bind(null, child)

  let timerId,
      errorOutput = ""

  t.plan(2)

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
  const child = createChild({
          file: require.resolve("../bin/server"),
          args: ["test/fixtures", "test/fixtures"],
          stdio: ["ignore", "pipe", "ignore"]
        }),
        expectedOutput = "Running server on port http://localhost:8080 with root in test/fixtures and listening for changes in test/fixtures\n",
        childKiller = kill.bind(null, child)
        
  let timerId,
      output = ""

  t.plan(2)

  child.on('exit', code => {
    t.ok((code|0) === 0, "should exit with error code 0")
    t.equal( eol.lf( output ), expectedOutput )
  })
  child.stdout.on("data", (chunk) => {
    if(timerId)
      clearTimeout(timerId)
    output += chunk
    timerId = timer(childKiller)
  })
})

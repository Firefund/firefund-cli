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
        expectedOutput = "Running ecstatic on http://localhost:8080 and livereload on http://localhost:8081 with root in test/fixtures and listening for changes in test/fixtures\n",
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

tap.test("server.es6::Run multiple instances of ecstatic", function(t) {
  t.plan(2)
  
  let port = ["-p", 8888]
  const file = require.resolve("../bin/server")
  const args = ["test/fixtures", "test/fixtures"]
  const stdio = ["ignore", "pipe", "pipe"]
  
  let child = createChild({ file, args: args.concat(port), stdio })
  const childKiller1 = kill.bind(null, child)
  child.stderr.on("data", data => {
    childKiller1()
    t.fail(`server.es6 threw an error: ${data}`)
  })
  child.stdout.on("data", data => {
    t.ok(true, data)
    childKiller1()
  })
  
  port =  ["--port", 8989]
  child = createChild({ file, args: args.concat(port), stdio })
  const childKiller2 = kill.bind(null, child)
  child.stderr.on("data", data => {
    childKiller2()
    t.fail(`server.es6 threw an error: ${data}`)
  })
  child.stdout.on("data", data => {
    t.ok(true, data)
    childKiller2()
  })

  // let timerId

  // t.plan(2)

  // child.on('exit', code => {
  //   t.ok((code|0) === 0, "should exit with error code 0")
  //   t.equal( eol.lf( output ), expectedOutput )
  // })
  // child.stdout.on("data", (chunk) => {
  //   if(timerId)
  //     clearTimeout(timerId)
  //   output += chunk
  //   timerId = timer(childKiller)
  // })
})
"use strict";

const tap = require("tap")
const spawn = require("child_process").spawn
const eol = require("eol")

tap.test("server.es6::missing arguments", function(t) {
  var actual, expected
  const env = process.env,
        args = [""],
        server = require.resolve("../bin/server")
  let child = spawn(server, args, {
        env,
        stdio: ["ignore", "ignore", "pipe"]
      }),
      timerId,
      errorOutput = ""

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
    timerId = timer(kill)
  })

  function timer(fn) {
    return setTimeout(fn, 100)
  }

  function kill() {
    child.kill("SIGTERM")
  }
})
/*
tap.test("server.es6", function(t) {
  var actual, expected
  const env = process.env,
        args = ["test/fixtures", "test/fixtures/"],
        server = require.resolve("../bin/server")
  const child = spawn(server, args, {
    env,
    stdio: "pipe"
  })

  t.plan(1)

  child.stdin.setEncoding("utf8")
  child.stdout.setEncoding("utf8")
  child.stderr.setEncoding("utf8")

  child.on('exit', code => {
    t.ok(code === 0, "should exit with error code 0")
    console.log( "stderr says:", child.stderr.read() )
    console.log( "stdout says:", child.stdout.read() )
    console.log( "stdin says:", child.stdin.read() )
    t.end()
  })
  setTimeout(() => {
    child.kill("SIGTERM")
  }, 1000)
})
*/

"use strict";

const tap = require("tap")
const spawn = require("child_process").spawn
const eol = require("eol")

tap.test("server.es6", function(t) {
  var actual, expected
  const env = process.env,
        args = ["fixtures fixtures/folder1"],
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
    console.log( child.stderr.read() )
    console.log( child.stdout.read() )
    console.log( child.stdin.read() )
    t.end()
  })

  child.kill("SIGTERM")
})

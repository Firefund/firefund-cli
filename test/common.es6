"use strict";

import tap from "tap"
import * as common from "../lib/common"
import {spawn} from "child_process"
import eol from "eol"

tap.test("common.args", function (t) {
  let actual, expected

  t.plan(3)

  expected = [null]
  actual = common.args
  t.deepEqual(actual, expected, "there should be no arguments to this test")



  const child = common.createChild({
    file: "test/test/common.args.js",
    args: ["test/a/number", "of/arguments"],
    stdio: ['ignore', 'pipe', 'ignore']
  })

  child.on('exit', code => {
    let expected = "test/a/number@@of/arguments\n",
        actual = child.stdout.read()
    t.ok(code === 0, "should exit with NO error code (0)")
    t.equal(eol.lf(actual), expected, "should be two paths join together with @@")
    t.end()
  })

})

tap.test("common.fst()", function (t) {
  let actual, expected

  t.plan(2)

  expected = null
  actual = common.fst([])
  t.ok(actual === expected, "an empty array should return null")

  expected = 1
  actual = common.fst([1,2,3])
  t.ok(actual === expected, "[1,2,3] should return 1")

  t.end()
})

tap.test("common.snd()", function (t) {
  let actual, expected

  t.plan(2)

  expected = null
  actual = common.snd([])
  t.ok(actual === expected, "[] should return null")

  expected = 2
  actual = common.snd([1,2,3])
  t.ok(actual === expected, "[1,2,3] should return 2")

  t.end()
})

tap.test("common.getParameters()", function (t) {
  let actual, expected

  t.plan(2)

  expected = [2]
  actual = common.getParameters("--two", ["--one", 1, "--two", 2])
  t.similar(actual, expected, "[\"--two\", \"--one\", 1, \"--two\", 2] should return [2]")

  expected = [2,2]
  actual = common.getParameters("--two", ["--one", 1, "--two", 2, "--two", 2])
  t.similar(actual, expected, "[\"--two\", \"--one\", 1, \"--two\", 2] should return [2,2]")

  t.end()
})

tap.test("common.errorOut()", function(t) {
  t.plan(2)

  const child = common.createChild({
    file: "test/test/common.errorOut.js",
    stdio: ['ignore', 'ignore', 'pipe']
  })

  child.on('exit', code => {
    let expected = "message\n",
      actual = child.stderr.read()

    t.ok(code === 1, "should exit with error code 1")
    t.equal(eol.lf(actual), expected, "should have 'message' in stderr")
    t.end()
  })
})

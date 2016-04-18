"use strict";

import tap from "tap"
import * as common from "../../lib/common"
import eol from "eol"


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


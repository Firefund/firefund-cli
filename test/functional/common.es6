"use strict";

import tap from "tap"
import * as common from "../../lib/common"
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

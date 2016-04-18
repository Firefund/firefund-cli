"use strict";

import tap from "tap"
import composer from "../../lib/composer"

tap.test("Composed functions", function (t) {
  let actual, expected
  let timesListenersAreCalled = 0
  const timesToRegisterListener = 2

  t.plan(timesToRegisterListener + 1)
  expected = "fake"

  // register listeners
  const listeners = composer(listener, listener);
  // call listeners with object
  listeners({
    url: "fake"
  })

  function listener(request, response) {
    actual = request.url
    t.ok(actual === expected, "request.url should be fake");

    timesListenersAreCalled += 1

    if(timesListenersAreCalled === timesToRegisterListener) {
      t.ok(timesListenersAreCalled === timesToRegisterListener, "should all be called")
      t.end()
    }
  }
})

"use strict";

const tap = require("tap");
const composer = require("../lib/composer");

tap.test("Composed functions", function (t) {
  var actual, expected
  let timesToRegisterListener = 2
  let timesListenersAreCalled = 0

  t.plan(timesToRegisterListener + 1)
  expected = "fake"

  // register listeners
  let listeners = composer(listener, listener);
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

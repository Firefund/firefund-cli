"use strict";

var tap = require("tap");
var composer = require("../lib/composer");

tap.test("Composed functions", function (t) {
  var actual, expected;
  var timesToRegisterListener = 2;
  var timesListenersAreCalled = 0;

  t.plan(timesToRegisterListener + 1);
  expected = "fake";

  // register listeners
  var listeners = composer(listener, listener);
  // call listeners with object
  listeners({
    url: "fake"
  });

  function listener(request, response) {
    actual = request.url;
    t.ok(actual === expected, "request.url should be fake");

    timesListenersAreCalled += 1;

    if (timesListenersAreCalled === timesToRegisterListener) {
      t.ok(timesListenersAreCalled === timesToRegisterListener, "should all be called");
      t.end();
    }
  }
});
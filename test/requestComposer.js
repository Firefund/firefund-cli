"use strict";

var tap = require("tap");
var composer = require("../lib.es5/composer");

tap.test("Composed functions", function (t) {
  let timesToRegisterListener = 2
  let timesListenersAreCalled = 0

  t.plan(timesToRegisterListener + 1)

  var listener = function listener(request, response) {
    t.ok(request.url === "fake", "request.url should be fake");
    timesListenersAreCalled += 1
    if(timesListenersAreCalled === timesToRegisterListener) {
      t.ok(timesListenersAreCalled === timesToRegisterListener, "should all be called")
      t.end()
    }
  }

  // register listener
  let listeners = composer(listener, listener);
  // call listeners with object
  listeners({
    url: "fake"
  })
});

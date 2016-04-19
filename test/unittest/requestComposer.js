"use strict";

var _tap = require("tap");

var tap = _interopRequireWildcard(_tap);

var _composer = require("../../lib/composer");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

tap.test("Composed functions", function (t) {
  var actual = void 0,
      expected = void 0;
  var timesListenersAreCalled = 0;
  var timesToRegisterListener = 2;

  t.plan(timesToRegisterListener + 1);
  expected = "fake";

  // register listeners
  var listeners = (0, _composer.composeListeners)(listener, listener);
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
"use strict";

var _tap = require("tap");

var _tap2 = _interopRequireDefault(_tap);

var _composer = require("../lib/composer");

var _composer2 = _interopRequireDefault(_composer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tap2.default.test("Composed functions", function (t) {
  var actual = void 0,
      expected = void 0;
  var timesListenersAreCalled = 0;
  var timesToRegisterListener = 2;

  t.plan(timesToRegisterListener + 1);
  expected = "fake";

  // register listeners
  var listeners = (0, _composer2.default)(listener, listener);
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
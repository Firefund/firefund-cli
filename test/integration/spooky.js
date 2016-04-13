"use strict";

var _spooky = require("spooky");

var _spooky2 = _interopRequireDefault(_spooky);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spooky = new _spooky2.default({
  child: {
    transport: "http"
  },
  casper: {
    logLevel: "debug",
    verbose: true
  }
}, function (err) {
  if (err) {
    var e = new Error("Failed to initialize SpookyJS");
    e.details = err;
    throw e;
  }

  spooky.start("http://localhost:8080");
  spooky.then(function () {
    this.emit("hello", "Hello, from " + this.evaluate(function () {
      return document.title;
    }));
  });
  spooky.run();
});

spooky.on("error", function (e, stack) {
  console.error(e);
  if (stack) console.log(stack);
});
spooky.on("console", function (line) {
  console.log(line);
});
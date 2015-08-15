"use strict";

module.export = {
  error: function errorOut(msg) {
    console.error(msg)
    process.exit(1);
  }
}

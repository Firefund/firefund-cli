"use strict";

var _path = require("path");

var path = _interopRequireWildcard(_path);

var _tap = require("tap");

var tap = _interopRequireWildcard(_tap);

var _common = require("../lib/common");

var c = _interopRequireWildcard(_common);

var _eol = require("eol");

var eol = _interopRequireWildcard(_eol);

var _shelljs = require("shelljs");

var shell = _interopRequireWildcard(_shelljs);

var _child_process = require("child_process");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function timer(fn) {
	return setTimeout(fn, 100);
}

tap.test("css::transpile postcss file to css" /*, t => {
                                              t.plan(2)
                                              const args = [
                                              path.resolve(__dirname, "./fixtures/folder1/postcss.css"),
                                              "-o",
                                              path.join(__dirname, "./test/temp.css")
                                              ],
                                              child = c.createChild({
                                              file: require.resolve("../bin/css.js"),
                                              args,
                                              stdio: ["ignore", "ignore", "pipe"],
                                              pipes: [false, false, true]
                                              })
                                              child.on('exit', code => {
                                              const filePath = args[2],
                                              expected = true
                                              let timerId
                                              t.equal(code, 0, "bin/css should exit clean")
                                              checkFile(filePath, actual => {
                                              t.equal(actual, expected, "test/temp.css should exist")
                                              // cleanup
                                              if(shell.test("-e", filePath)) shell.rm(filePath)
                                              t.end()
                                              })
                                              function checkFile(path, cb, counter=0) {
                                              if(timerId)	clearTimeout(timerId)
                                              if(shell.test("-e", filePath)) {
                                              cb(true)
                                              return
                                              }
                                              if(counter > 3) {
                                              cb(false)
                                              return
                                              }
                                              timerId = timer(() => { checkFile(path, cb, counter + 1) })
                                              }
                                              })
                                              }*/);

tap.test("css::transpile directory to new location while keeping directory structure" /*, t => {
                                                                                      let actual, expected
                                                                                      t.end()
                                                                                      }*/);
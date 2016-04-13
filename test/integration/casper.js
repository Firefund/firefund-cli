"use strict";

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spawn = require("child_process").spawn;
require("shelljs/global");

if (!process.env.PHANTOMJS_EXECUTABLE) process.env.PHANTOMJS_EXECUTABLE = _path2.default.resolve(_path2.default.join(__dirname, "../node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs"));

function createChild(_ref) {
  var _ref$exec = _ref.exec;
  var exec = _ref$exec === undefined ? process.execPath : _ref$exec;
  var args = _ref.args;
  var env = _ref.env;
  var stdio = _ref.stdio;

  return spawn(exec, args, { env: env, stdio: stdio });
}

var options = {
  exec: require.resolve("../node_modules/casperjs/bin/casperjs"),
  args: [require.resolve("./t")],
  env: process.env,
  stdio: 'pipe'
};
/*const child = exec(require.resolve("../node_modules/.bin/casperjs") + " " + require.resolve("./t"), { env: process.env }, (code, stdout, stderr) => {
  console.log('Exit code:', code);
  console.log('Program output:', stdout);
  console.log('Program stderr:', stderr);
})*/
console.log(process.env.PHANTOMJS_EXECUTABLE);

var child = createChild(options);
child.stdout.on("data", function (msg) {
  return console.log(msg.toString());
});
child.stderr.on("data", function (msg) {
  return console.log(msg.toString());
});
child.on("exit", function (code) {
  return console.log("Ending with code: %d", code);
});
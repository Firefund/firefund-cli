#!/usr/bin/env node


"use strict";

var _common = require("../lib/common");

var c = _interopRequireWildcard(_common);

var _path = require("path");

var path = _interopRequireWildcard(_path);

var _shelljs = require("shelljs");

var shell = _interopRequireWildcard(_shelljs);

var _bowerCopy = require("bower-copy");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var dest = c.fst(c.args); // null or first argument to assets

var copyPath = void 0;

if (c.isNotEmpty(c.getParameters("-h", c.args))) {
  showHelp();
  process.exit();
} else if (!dest) {
  showHelp();
  c.errorOut("Destination path for asssets is required!");
}

//shell.exec("echo " + args.toString())

copyPath = path.resolve(process.cwd(), dest);

// install bower components defined in calling bower.json
if (shell.which("bower")) shell.exec("bower install");else c.errorOut("You need to install bower to download the asssets.\r\nnpm install -g bower");

// copy assets from bower_components to supplied copyPath
(0, _bowerCopy.copyComponents)({ dest: copyPath }, function (err, copied) {
  if (err) c.errorOut(err);
});

function showHelp() {
  console.log("usage:\tassets path\t\tcopy bower components to the path specified");
  console.log("\tassets -h\t\tprint this help");
}
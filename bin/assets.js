#!/usr/bin/env node

"use strict";

var c = require("../lib/common.js")
console.dir(c)
var dest = c.fst(c.args) // null or first argument to assets
var path = require("path");
var shell = require("shelljs")
var copy = require("bower-copy").copyComponents
var copyPath

//shell.exec("echo " + args.toString())
if(!dest) {
  c.error("Destination path for asssets is required!")
}
copyPath = path.resolve(process.cwd(), dest);

// install bower components defined in calling bower.json
if(shell.which("bower")) {
  shell.exec("bower install")
} else {
  c.error("You need to install bower to download the asssets.\r\nnpm install -g bower")
}

// copy assets from bower_components to supplied copyPath
copy({ dest: copyPath }, function(err, copied) {
  if(err) c.error(err)
})

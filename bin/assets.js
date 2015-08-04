#!/usr/bin/env node

var path = require("path");
var shell = require("shelljs")
var args = process.argv.slice(2)
var copy = require("bower-copy").copyComponents
var copyPath

//shell.exec("echo " + args.toString())
if(!args[0]) {
  errorOut("Destination path for asssets is required!")
}
copyPath = path.resolve(process.cwd(), args[0]);

// install bower components defined in calling bower.json
if(shell.which("bower")) {
  shell.exec("bower install")
} else {
  errorOut("You need to install bower to download the asssets.\r\nnpm install -g bower")
}

// copy assets from bower_components to supplied copyPath
copy({ dest: copyPath }, function(err, copied) {
  if(err) errorOut(err)
})

function errorOut(msg) {
  console.error(msg)
  process.exit(1);
}

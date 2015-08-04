#!/usr/bin/env node

var path = require("path");
var shell = require("shelljs")
var args = process.argv.slice(2)
var copyPath = path.resolve(__dirname, "../node_modules/.bin/bower-copy")

//shell.exec("echo " + args.toString())

// install bower components define in calling bower.json
if(shell.which("bower")) {
  shell.exec("bower install")
} else {
  console.error("You need to install bower to download the asssets.\r\nnpm install -g bower")
  process.exit(1);
}

//console.log(copyPath + " -r " + path.resolve(process.cwd(), args[0]))
//shell.exec(copyPath + " -r " + path.resolve(process.cwd(), args[0]));

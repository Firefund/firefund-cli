#!/usr/bin/env node

"use strict";

import * as c from "../lib/common"
import * as path from "path"
import * as shell from "shelljs"
import {copyComponents as copy} from "bower-copy"

const dest = c.fst(c.args) // null or first argument to assets

let copyPath

if( c.isNotEmpty(c.getParameters("-h", c.args)) ) {
  showHelp()
  process.exit()
} else if(!dest) {
  showHelp()
  c.errorOut("Destination path for asssets is required!")
}

//shell.exec("echo " + args.toString())

copyPath = path.resolve(process.cwd(), dest)

// install bower components defined in calling bower.json
if(shell.which("bower")) shell.exec("bower install")
else c.errorOut("You need to install bower to download the asssets.\r\nnpm install -g bower")

// copy assets from bower_components to supplied copyPath
copy({ dest: copyPath, newer: true }, (err, copied) => {
  if(err) c.errorOut(err)
  console.log(copied)
})

function showHelp() {
  console.log("usage:\tassets path\t\tcopy bower components to the path specified")
  console.log("\tassets -h\t\tprint this help")
}
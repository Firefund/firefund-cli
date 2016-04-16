"use strict";

import path from "path"
const tap = require("tap")
const common = require("../lib/common")
const spawn = require("child_process").spawn
const eol = require("eol")
const shell = require("shelljs")

function createChild({ exec=process.execPath, file, args=[], env=process.env, stdio=['ignore', 'ignore', 'ignore'] }) {
  const spawnArgs = [file].concat.apply(args), // prepend file to args
				child = spawn(exec, args, { env, stdio }),
        fileDescriptors = ["stdin", "stdout", "stderr"]

  //setEncoding to utf8 for stdio file descriptors that is set to pipe
  //to get a string instead of a bufffer when reading from them
  fileDescriptors.forEach((fd, n) => {
    if(stdio[n] === "pipe") child[fd].setEncoding("utf8")
  })

  return child
}

tap.test("css::transpile postcss file to css", t => {
	t.plan(1)
	
  const args = (["fixtures/folder1/postcss.css", "-o test/temp.css"]).map(p => path.join(__dirname, p)),
				child = createChild({
					file: "../bin/css.js",
					args,
					stdio: ['ignore', 'pipe', 'pipe']
				})
	
	child.stderr.on("data", msg => console.error(msg))
	child.stdout.on("data", msg => console.warn(msg))

  child.on('exit', code => {
    let filePath = common.snd(args),
				actual = shell.test("-e", filePath),
    		expected = true
		// console.warn("CSS TEST COMMOND.SND!!!!", args, common.snd(args))
    t.equal(actual, expected, "test/temp.css should exist")
		
		// cleanup
		if(shell.test("-e", filePath)) shell.rm(filePath)
		
    t.end()
  })

})

tap.test("css::transpile directory to new location while keeping directory structure", t => {
	let actual, expected
	t.end()
})

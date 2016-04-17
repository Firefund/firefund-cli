"use strict"

require("leaked-handles")
import path from "path"
import tap from "tap"
import common from "../lib/common"
import eol from "eol"
import shell from "shelljs"
import {spawn} from "child_process"

function createChild({ exec=process.execPath, file, args=[], env=process.env, stdio=['ignore', 'ignore', 'ignore'] }) {
  const spawnArgs = [file, ...args], // prepend file to args
				child = spawn(exec, spawnArgs, { env, stdio }),
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
	
  const args = [
			path.resolve(__dirname, "./fixtures/folder1/postcss.css"),
			"-o",
			path.resolve(__dirname, "./test/temp.css")
	],
	child = createChild({
		file: require.resolve("../bin/css.js"),
		args,
		stdio: ["ignore", "pipe", "pipe"]
	})

	child.stderr.pipe(process.stderr)
	child.stdout.pipe(process.stdout)

  child.on('exit', code => {
    let filePath = common.snd(args),
				actual = shell.test("-e", path.resolve(filePath)),
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

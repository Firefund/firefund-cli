"use strict"

import * as path from "path"
import * as tap from "tap"
import * as c from "../lib/common"
import * as eol from "eol"
import * as shell from "shelljs"
import {spawn} from "child_process"

function timer(fn) {
	return setTimeout(fn, 100)
}

tap.test("css::transpile postcss file to css", t => {
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

})

/*tap.test("css::transpile directory to new location while keeping directory structure", t => {
	let actual, expected
	t.end()
})*/

"use strict"

require("leaked-handles")
import path from "path"
import tap from "tap"
import * as c from "../lib/common"
import eol from "eol"
import shell from "shelljs"
import {spawn} from "child_process"

tap.test("css::transpile postcss file to css", t => {
	t.plan(1)
	
  const args = [
		path.resolve(__dirname, "./fixtures/folder1/postcss.css"),
		"-o",
		path.resolve(__dirname, "./test/temp.css")
	],
	child = c.createChild({
		file: require.resolve("../bin/css.js"),
		args,
		stdio: ["ignore", "pipe", "pipe"],
    pipes: [false, true, true]
	})

  child.on('exit', code => {
    let filePath = c.snd(args),
				actual = shell.test("-e", path.resolve(filePath)),
    		expected = true
		// console.warn("CSS TEST C.SND!!!!", args, c.snd(args))
    t.equal(actual, expected, "test/temp.css should exist")
		
		// cleanup
		if(shell.test("-e", filePath)) shell.rm(filePath), console.warn("deleting file!!!")
		
    t.end()
  })

})

tap.test("css::transpile directory to new location while keeping directory structure", t => {
	let actual, expected
	t.end()
})

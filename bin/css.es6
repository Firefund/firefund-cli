#!/usr/bin/env node

"use strict";

import c from "../lib/common.js"
// import shell from "shelljs"
import {spawn} from "child_process"
import path from "path"
// import * as postcss from "postcss"
const args = c.args

//TODO: change the css command in firefund-cli to accept a directory and pass all the files to postcss
/*const postcssInput = invert(args, concat(
  c.getParameters("-d", args),
  c.getParameters("--dir", args)
))*/
function invert(arr, selection) {
  return arr.filter(n => selection.indexOf(n) === -1)
}
function concat(arr1, arr2) {
  return [...arr1, ...arr2]
}
/*console.warn("POSTCSSINPUT!!!!!!!!!!!!!!!!!!!!!")
console.warn(postcssInput)*/

//TODO: check for compiled css folder and create it if missing
//TODO: use shelljs to create a nodemon process that watches the develop css folder
//TODO: make css create two builds, one for prod and one for dev (no minifying)


// direct arguments/paramenters to postcss + adding some default plugins
function createChild({ exec=process.execPath, file, args=[], env=process.env, stdio=['ignore', 'ignore', 'ignore'] }) {
  const spawnArgs = [file, ...args], // prepend file to args
				child = spawn(exec, spawnArgs, { env, stdio }),
        fileDescriptors = ["stdin", "stdout", "stderr"]
console.log("spawnArgs", spawnArgs)
  //setEncoding to utf8 for stdio file descriptors that is set to pipe
  //to get a string instead of a bufffer when reading from them
  fileDescriptors.forEach((fd, n) => {
    if(stdio[n] === "pipe") child[fd].setEncoding("utf8")
  })

  return child
}
console.log( ["-u postcss-cssnext", "-u lost", ...args])
console.log("env:", process.cwd())
const child = createChild({
  file: require.resolve("postcss-cli"),
  args: ["--use", "postcss-cssnext", "--use", "lost", ...args],
  stdio: ["ignore", "pipe", "pipe"]
})
child.stderr.on("data", msg => console.error(msg))
child.stdout.on("data", msg => console.warn(msg))

// postcss([require("postcss-cssnext"), require("lost")]).process()
// shell.exec(path.normalize(`${process.execPath} ${require.resolve("postcss")} --use postcss-cssnext --use lost ${args.join(" ")}`))
// const execPostcssCommand = `${path.resolve("./node_modules/.bin/postcss")} --use postcss-cssnext --use lost ${args.join(" ")}`
// //console.warn(execPostcssCommand)
// shell.exec(execPostcssCommand, (error, stdout, stderr) => {
//   if(error !== null) console.log(`exec error: ${error}`)
//   console.log(`stdout: ${stdout}`);
//   console.log(`stderr: ${stderr}`);
// })

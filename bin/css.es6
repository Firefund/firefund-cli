#!/usr/bin/env node

"use strict";

import * as c from "../lib/common.js"
import * as shell from "shelljs"
const args = c.args

//TODO: change the css command in firefund-cli to accept a directory and pass all the files to postcss
const postcssOutput = concat(
  concat(
    c.getParameters("-o", args),
    c.getParameters("--output", args)
  ),
  concat(
    c.getParameters("-d", args),
    c.getParameters("--dir", args)
  )
)
const postcssInput = reject(args, postcssOutput.concat(["-o", "--output", "-d", "-dir"]))

if(isEmpty(postcssInput)) postcssInput.concat(args.slice(-1))
if(isEmpty(postcssOutput)) throw new TypeError("firefund-cli: output location is ommitted")


function concat(arr1, arr2) {
  return [...arr1, ...arr2]
}
function isEmpty(array) { return array.length === 0 }
function reject(arr, selection) {
  return arr.filter(n => selection.indexOf(n) === -1)
}

console.warn(postcssInput)
console.warn(postcssOutput)

//TODO: check for output css folder and create it if missing
if(!shell.test("-e", c.fst(postcssOutput))) shell.mkdir("-p", postcssOutput)
else if(!shell.test("-d", c.fst(postcssOutput))) throw new Error(`${c.fst(postcssOutput)} is not a directory`)
//TODO: use shelljs to create a nodemon process that watches the develop css folder
//TODO: make css create two builds, one for prod and one for dev (no minifying)


// direct arguments/paramenters to postcss + adding some default plugins
// console.log( ["-u postcss-cssnext", "-u lost", ...args])
// console.log("cwd:", process.cwd())
const child = c.createChild({
  file: require.resolve("postcss-cli"),
  args: ["--use", "postcss-cssnext", "--use", "lost", ...args],
  stdio: ["ignore", "pipe", "pipe"],
  pipes: [false, true, true]
})

// postcss([require("postcss-cssnext"), require("lost")]).process()
// shell.exec(path.normalize(`${process.execPath} ${require.resolve("postcss")} --use postcss-cssnext --use lost ${args.join(" ")}`))
// const execPostcssCommand = `${path.resolve("./node_modules/.bin/postcss")} --use postcss-cssnext --use lost ${args.join(" ")}`
// //console.warn(execPostcssCommand)
// shell.exec(execPostcssCommand, (error, stdout, stderr) => {
//   if(error !== null) console.log(`exec error: ${error}`)
//   console.log(`stdout: ${stdout}`);
//   console.log(`stderr: ${stderr}`);
// })

#!/usr/bin/env node

"use strict";

import * as c from "../lib/common.js"
import * as path from "path"
// import * as postcss from "postcss"
const args = c.args

//TODO: change the css command in firefund-cli to accept a directory and pass all the files to postcss
// instead do: getParameters -o and get the last item from args
/*const postcssInput = reject(args, concat(
  c.getParameters("-d", args),
  c.getParameters("--dir", args)
))*/
function reject(arr, selection) {
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
// console.log( ["-u postcss-cssnext", "-u lost", ...args])
// console.log("cwd:", process.cwd())
const child = c.createChild({
  file: require.resolve("postcss-cli"),
  args: ["--use", "postcss-cssnext", "--use", "lost", ...args],
  stdio: ["ignore", "pipe", "pipe"]
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

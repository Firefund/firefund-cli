#!/usr/bin/env node

"use strict";

require("leaked-handles")
import c from "../lib/common.js"
// import shell from "shelljs"
import {spawn} from "child_process"
import path from "path"
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


/**
 * Spawn child process helper.
 * @param {object} param
 * @param  {string} param.exec    - path to executable, default: process.execPath
 * @param  {string} param.file    - path to file you want to execute with exec
 * @param  {string[]} param.args  - default: []
 * @param  {object} param.env     - default: process.execPath
 * @param  {string[]} param.stdio - default: ["ignore", "ignore", "ignore"]
 * @param  {boolean[]} param.pipes- default: [true, true, true]}
 * @return {child_process} A child process running your param.file
 */
function createChild({
    exec=process.execPath,
    file,
    args=[],
    env=process.env,
    stdio=["ignore", "ignore", "ignore"],
    pipes=[true, true, true]
})
{
  const spawnArgs = [file, ...args], // prepend file to args
				child = spawn(exec, spawnArgs, { env, stdio }),
        fileDescriptorNames = ["stdin", "stdout", "stderr"] 
// console.log("spawnArgs", spawnArgs)

  //setEncoding to utf8 for stdio file descriptors that is set to pipe
  //to get a string instead of a bufffer when reading from them
  const fileDescriptors = fileDescriptorNames.map((fd, n) =>
    stdio[n] === "pipe" ? child[fd].setEncoding("utf8") : child[fd]
  )
// console.dir(fileDescriptors)

  // auto remove file descriptor if they are closed
  fileDescriptors.forEach(autoRemoveFileDescriptor)

  child.on("close", (code, signal) => {
    fileDescriptors.forEach(closeFileDescriptor)
  })
  
  //  for each true item in pipes,
  // auto pipe file descriptors to their corresponding process file descriptor
  fileDescriptors.forEach(pipeToProcess)

  return child

  function autoRemoveFileDescriptor(fd, n, all) {
    if(fd === null) return
    fd.on("close", () => {
      const indexOfFileDescriptor = all.indexOf(fd)
      if(indexOfFileDescriptor > -1) all[indexOfFileDescriptor] = null
    })
  }
  function closeFileDescriptor(fd) {
    if(fd !== null && fd.destroyed === false) fd.destroy()
  }
  function pipeToProcess(fd, n) {
    if(fd !== null && pipes[n]) fd.pipe(process[fileDescriptorNames[n]])
  }
}

// direct arguments/paramenters to postcss + adding some default plugins
// console.log( ["-u postcss-cssnext", "-u lost", ...args])
// console.log("cwd:", process.cwd())
const child = createChild({
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

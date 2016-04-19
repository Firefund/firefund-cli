"use strict";

import {getParameters, createChild, args, fst, identity, isEmpty, isNotEmpty} from "../lib/common"
import {compose} from "../lib/composer"
import * as shell from "shelljs"
import {EventEmitter} from "events"
import * as path from "path"

export {
	postcssHandler,
	callPath
}

const typeHandlers = [
	class Replace {
		constructor(output) {
			console.log("Replace", output)
			const path = fst(output)
			if( shell.test("-d", path) ) throw new Error("Not implemented by postcss-cli")
		}
	},
	class Directory {
		constructor(output) {
			console.log("Directory", output)
		}
	},
	class File {
		constructor(output) {
			console.log("File", output)
		}
	}
]

const eventEmitter = new EventEmitter()

function callPath(parameters) {
	const types = ["-r","-d","-o"]
	const alternatives = ["--replace","--dir","--output"]
/*const callTypes = zip(types, alternatives).map(
		flags => 
			flags
				.map( flag => getParameters(flag, args) )
				.filter( isNotEmpty )		
	).map( (path, i, all) => path.length ? new typeHandlers[i](fst(path)) : null )*/
	/*const CallType = convertPathsToObject(
		typeHandlers,
		getPathFromParameters(
			parameters, searchWith(types, alternatives)
		)		
	).filter(identity)*/
	const getCallType = compose(
		searchWith,
		callWith(getPathFromParameters, parameters),
		callWith(convertPathsToObject, typeHandlers),
		(x) => Array.prototype.filter.call(x, identity)
	)
	const CallType = getCallType(types, alternatives)
	
	
	
	console.log(new CallType[0])
}
/** searchWith :: [a] -> [b] -> [c] */
function searchWith(a,b) { return zip(a,b) }
/** callWith :: [a] -> [b] -> M(a) */
function callWith(fn, ...a) {
	// it seems that a bug in babel scoping prevents us from using 'args' as named argument
	return fn.bind(null, ...a)
}
/** getPathForParameters :: (String a) => [a] -> [a] -> [a] */
function getPathFromParameters(parameters, search) {
	return search.map(
		searchKeys =>	searchKeys.map(
			s => getParameters(s, parameters)
		)
		.filter(isNotEmpty)
	)
}
/** convertPathsToObject :: (String a) => [a] -> [b] -> [b] */
function convertPathsToObject(classTuple, paths) {
	return paths.map(
		(path, i) => isNotEmpty(path) && classTuple[i].bind(null, fst(path))
	)
}
/* zipWith :: (a -> b -> c) -> [a] -> [b] -> [c] */
function zipWith(f, xs, ys) {
	if(isEmpty(xs || isEmpty(ys))) return []
  let x = xs[0],
      y = ys[0]
  xs = xs.slice(1)
  ys = ys.slice(1)
  return [f(x, y)].concat(zipWith(f, xs, ys))
}
/* zip :: [a] -> [b] -> [(a, b)] */
function zip(a,b) {
  if(isEmpty(a || isEmpty(b))) return []
  let x = a[0],
      y = b[0]
  return [[x, y]].concat(zip(a.slice(1), b.slice(1)))
}

/** is element in array
 *  elem :: (Eq a) => a -> [a] -> Bool */
function elem (a, b) {
  if(b.length === 0) return false
  const x = b[0]
  return a == x || elem(a, b.slice(1))
}

function postcssHandler(args) {
	const postcssOutput = getOutputTarget(args)
	const postcssInput = getInputTarget(args, postcssOutput)

//TODO: remove debug stuff
console.warn(postcssInput)
console.warn(postcssOutput)

	if(isEmpty(postcssOutput)) throw new TypeError("firefund-cli: output location is ommitted")

  postcssInput.forEach(input => {
    if(isDir(input)) transpileDir(input)
	  else transpileFiles(input, fst(postcssOutput), args)
  })
  
  return eventEmitter
}
function getOutputTarget(args) {
  return concat(
    concat(
      getParameters("-o", args),
      getParameters("--output", args)
    ),
    concat(
      getParameters("-d", args),
      getParameters("--dir", args)
    )
  )
}
function getInputTarget(args, outputTarget) {
  const postcssInput = reject(args, outputTarget.concat(["-o", "--output", "-d", "-dir"]))
	if(isEmpty(postcssInput)) postcssInput.concat(args.slice(-1))
	return postcssInput
}
function isDir(target) {
	 return shell.test("-e", target) && shell.test("-d", target)
 }
function transpileDir(target) {
  // check for output css folder and create it if missing
  createDir(target)
  // direct arguments/paramenters to postcss + adding some default plugins
  // console.log( ["-u postcss-cssnext", "-u lost", ...args])
  // console.log("cwd:", process.cwd())
  const child = createChild({
    file: require.resolve("postcss-cli"),
    args: ["--use", "postcss-cssnext", "--use", "lost", ...args],
    stdio: ["ignore", "pipe", "pipe"],
    pipes: [false, true, true]
  })
  child.on("exit", () => { eventEmitter.emit("sent") })
}
function transpileFiles(target, args) {
  createDir(target)
  // direct arguments/paramenters to postcss + adding some default plugins
  console.log( ["-u postcss-cssnext", "-u lost", ...args])
  console.log("cwd:", process.cwd())
  const child = createChild({
    file: require.resolve("postcss-cli"),
    args: ["--use", "postcss-cssnext", "--use", "lost", ...args],
    stdio: ["ignore", "pipe", "pipe"],
    pipes: [false, true, true]
  })
  child.on("exit", () => { eventEmitter.emit("sent") })
}

/**
 * utility functions
*/
/** concat :: [a] -> [b] -> [(a,b)] */
function concat(arr1, arr2) {
  return [...arr1, ...arr2]
}
/** reject :: [a] -> [b] -> [c] */
function reject(arr, selection) {
  return arr.filter(n => selection.indexOf(n) === -1)
}
function createDir(dirPath) {
  if(!shell.test("-d", dirPath)) shell.mkdir("-p", path.dirname(dirPath))
}



//else if(!shell.test("-d", fst(postcssOutput))) throw new Error(`firefund-cli: ${fst(postcssOutput)} is not a directory`)
//TODO: use shelljs to create a nodemon process that watches the develop css folder
//TODO: make css create two builds, one for prod and one for dev (no minifying)



// postcss([require("postcss-cssnext"), require("lost")]).process()
// shell.exec(path.normalize(`${process.execPath} ${require.resolve("postcss")} --use postcss-cssnext --use lost ${args.join(" ")}`))
// const execPostcssCommand = `${path.resolve("./node_modules/.bin/postcss")} --use postcss-cssnext --use lost ${args.join(" ")}`
// //console.warn(execPostcssCommand)
// shell.exec(execPostcssCommand, (error, stdout, stderr) => {
//   if(error !== null) console.log(`exec error: ${error}`)
//   console.log(`stdout: ${stdout}`);
//   console.log(`stderr: ${stderr}`);
// })


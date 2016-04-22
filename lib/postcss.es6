"use strict";

import {getParameters, createChild, args, fst, snd, identity, isEmpty, isNotEmpty} from "../lib/common"
import {compose} from "../lib/composer"
import * as _ from "underscore"
import * as shell from "shelljs"
import {EventEmitter} from "events"
import * as path from "path"

class Replace {
	constructor(io) {
		// console.log("Replace", io)
		this.input = io.map(p =>
			path.resolve(__dirname, p)
		)		
	}
	validate() {
		this.input.forEach(input => {
			if( shell.test("-d", input) ) throw new Error("Not implemented by postcss-clip")
		})
	}
}
class Directory {
	constructor(io) {
		//console.log("Directory", output)
		this.input = io.map(p => 
			path.resolve(__dirname, p)
		)
	}
	validate() {
		this.input.forEach({
			
		})
	}
}
class File {
	constructor(io) {
		console.log("File", io)
		this.input = io.map(p => 
			path.resolve(__dirname, p)
		)
	}
	validate() {
		// TODO: wrong order of this.input - fix by changing convertPathsToObject.constructorArguments
		const input = fst(this.input)
		const output = snd(this.input)
		if( shell.test("-f", input) && shell.test("-d", output) ) throw new Error("Can not transpile a directory to a file - yet")  
	}
}
class Io extends Array {
	constructor([output, ...inputs]) {
		super([output, ...inputs].length)
		this.output = output
		this.input = inputs
	}
}

export {
	postcssHandler,
	getTypeFromOption,
	Replace,
	Directory,
	File
}

const typeHandlers = [Replace, Directory, File]

const eventEmitter = new EventEmitter()

function getTypeFromOption(parameters) {
	const types = ["-r","-d","-o"]
	const alternatives = ["--replace","--dir","--output"]
/* First: procedural FP */
	/*const CallType = zip(types, alternatives).map(
		flags => 
			flags
				.map( flag => getParameters(flag, parameters) )
				.filter( isNotEmpty )		
	).map( (path, i, all) => path.length ? typeHandlers[i].bind(null, fst(path)) : null )
	.filter(identity)*/
	
	/* Second: Convoluted FP */
	/*const CallType = convertPathsToObject(
		typeHandlers,
		getPathFromParameters(
			parameters, searchWith(types, alternatives)
		)		
	).filter(identity)*/

	/* Third: composed FP */
	// const getCallType = compose(
	// 	searchWith, // the search criteria function
	// 	bind(getPathFromParameters, parameters), // get the path from the parameters
	// 	bind(convertPathsToObject, typeHandlers), // get the right instance of class(!)
	// 	(x) => Array.prototype.filter.call(x, identity) // remove empty slots in the array
	// )
	// const CallType = getCallType(types, alternatives) // invoke the chain with the search criteria
	// console.log(new CallType[0])
	//return CallType
	const searchFlags = _.zip(types, alternatives)
	// [[2],[2]] -> [ [2], ["ds", null] ]
	const output = _.flatten(_.collect(searchFlags, flags =>
		_.map(flags, flag =>
			[flag, getParameters(flag, parameters)]
		).filter(flags => isNotEmpty( snd(flags) ))
	)).filter(isNotEmpty)
	const getOutput = _.compose(
		flags => _.map(flags, _.partial(getParameters, _, parameters))
	)
	
	console.log("out",output)
	console.log("out2",getOutput(searchFlags))
	console.log("paramenters", parameters)
}

/** flip :: (a -> b -> c) -> b -> a -> c */
function flip(f) { return (b,a) => f(a,b) }

function map(fn) {
	return  (array) => Array.prototype.map.bind(array, fn)
}
/** searchWith :: [a] -> [b] -> [c] */
function searchWith(a,b) { return zip(a,b) }
/** bind :: [a] -> [b] -> M(a) */
function bind(fn, ...a) {
	// it seems that a bug in babel scoping prevents us from using 'args' as named argument
	return fn.bind(null, ...a)
}
/** getPathForParameters :: (String a) => [a] -> [a] -> [a] */
function getPathFromParameters(parameters, search) {
	const output = search.map(
		searchKeys =>	searchKeys.map(
			s => getParameters(s, parameters)
		)
		.filter(isNotEmpty)
	)
	const input = getInputTarget(parameters, flatten(output.concat(search)))
	return { input,	output }
}
/** convertPathsToObject :: (String a) => [a] -> [b] -> [b] */
function convertPathsToObject(classTuple, paths) {
	return paths.map(
		(path, i) => isNotEmpty(path) && { // use Monad?
			class: classTuple[i],
			constructorArguments: fst(path)
		}
	)
}
/** tco */
function foldl(fn, terminalValue, [first, ...rest]) { 
  return first === void 0
   ? terminalValue
   : foldl(fn, fn(terminalValue, first), rest)
}
function flatten(list) {
	return foldl((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b)
		, []
		, list	
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
/** zip :: [a] -> [b] -> [(a, b)]
 * @param {array} a
 * @param {array} b
 * @return {array[]} [(a, b)]
*/
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
	const types = ["-r","-d","-o"]
	const alternatives = ["--replace","--dir","--output"]
	const search =  zip(types, alternatives)
	const postcssOutput = getOutputTarget(args, search)
	const postcssInput = getInputTarget(args, postcssOutput.concat(search))

//TODO: remove debug stuff
console.warn(postcssInput)
console.warn(postcssOutput)

	if(isEmpty(postcssOutput)) throw new TypeError("firefund-cli: output location is ommitted")

  postcssInput.forEach(input => {
    if(isDir(input)) transpileDir(input)
	  else transpileFiled(input, fst(postcssOutput), args)
  })
  
  return eventEmitter
}
function getOutputTarget(parameters, search) {
  return search.map(
		searchKeys =>	searchKeys.map(
			s => getParameters(s, parameters)
		)
		.filter(isNotEmpty)
	)
}
function getInputTarget(parameters, outputTarget) {
  const postcssInput = reject(parameters, outputTarget)
	if(isEmpty(postcssInput)) postcssInput.concat(parameters.slice(-1))
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


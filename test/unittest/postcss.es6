"use strict"

import * as tap from "tap"
import {postcssHandler, callPath} from "../../lib/postcss"
import * as path from "path"
import * as shell from "shelljs"

const INPUTFILE = path.resolve(__dirname, "../fixtures/folder1/postcss.css")
const TEMPDIR = path.resolve(__dirname, "../temp/")
const getOutputFile = (function getOutputFile() {
	let counter = 0
	return () => counter++
}())
/** 
 * change the css command in firefund-cli to accept a directory and pass all the files to postcss

Sub tasks:
- [x]  transpile one file to target directory
- [ ] directory to directory, file by file (retain structure)
- [ ] file and directory to directory, file by file (retain structure)
- [ ] directory and directory to directory, file by file (retain structure)
- [ ] directory to replace, throw "Not implemented by postcss"
- [ ] directory to file throw "Not implemented by postcss"
- [ ] file and directory to replace, throw "Not implemented by postcss"
- [ ] directory and directory to replace throw "Not implemented by postcss"
- [ ] file to replace, pass on to postcss
- [ ] file to directory pass on to postcss
- [ ] file to file, pass on to postcss
- [ ] file and file to replace, pass on to postcss
- [ ] file and file to directory, pass on to postcss but warn structure fuck up
- [ ] file and file to file, pass on to postcss (postscss will error)
- [ ] file and directory to file, pass on to postcss (postscss will error)
- [ ] directory and directory to file, pass on to postcss (postscss will error)

### argument combinations to postcss

- `--replace` can be replaced with `-r`
- `--dir` can be replaced with `-d`
- `--output` can be replaced with `-o`

1. `--replace inputFile` [1]
2. `--dir outputDir inputFile` [1]
3. `--output outputFile inputFile` [1]

4. `--replace inputDir` [5]
5. `--dir outputDir inputDir` [2]
6. `--output outputFile inputDir` [3]

7. `--replace inputFile inputFile ...` [1]
8. `--dir outputDir inputFile inputFile` [1.1]
9. `--output outputFile inputFile inputFile ...` [1] - postscss will error

10. `--replace inputFile inputDir ...` [5]
11. `--dir outputDir inputFile inputDir ...` [2]
12. `--output outputFile inputFile inputDir ...` [1] - postscss will error

13. `--replace inputDir inputDir` [5]
14. `--dir outputDir inputDir inputDir ...` [2]
15. `--output outputDir inputDir inputDir` [1]- postscss will error

16. `--output outputDir inputDir ` [4]
17. `--output outputDir inputFile ` [4]
18. `--dir outputFile intputDir` [4]
19. `--dir outputFile intputFile` [4]

### ACTIONS:

 [1] - transpile files to output - direct pass on args to postcss
	[1.1]  direct pass on args to postcss - warn that folder structure is lost
 [2] - recursively transpile all files in dir to output dir while retaining the dir structure
 [3] - `throw new Error("Can not transpile a directory to a file - yet")`
 [4] - `throw new Error("output has to be a directory when input is a directory - did you mean to use --dir")`
 [5] - `throw new Error("Not implemented by postcss-cli")`
 **/
 function setupReplaceTest() {
	 shell.cp("-f", INPUTFILE, TEMPDIR)
 }
// tap.test("postcss::call paths", t => {
	let actual, expected

	//const replaceInputFile = path.resolve("../temp/postcss.css")
	/**
	 * format:	[-d|-o, output, input]
	 * 					[-r, input]
	 */
	const fileToReplace		= ["-r", INPUTFILE]
	const fileToDir				= ["-d", TEMPDIR, INPUTFILE]
	const fileToFile			= ["-o", INPUTFILE, INPUTFILE]
	const dirToReplace		= ["-r", INPUTFILE, TEMPDIR]
	const dirToDir				= ["-d", TEMPDIR, TEMPDIR]
	const dirToFile				= ["-o", TEMPDIR, INPUTFILE]
	const filesToReplace	= ["-r", INPUTFILE, INPUTFILE]
	const filesToDir			= ["-d", TEMPDIR, INPUTFILE, INPUTFILE]
	const filesToFile			= ["-o", INPUTFILE, INPUTFILE, INPUTFILE]
	const mixedToReplace	= ["-r", INPUTFILE, TEMPDIR]
	const mixedToDir			= ["-d", TEMPDIR, INPUTFILE, TEMPDIR]
	const mixedToFile			= ["-o", INPUTFILE, INPUTFILE, TEMPDIR]
	const dirsToReplace		= ["-r", TEMPDIR, TEMPDIR]
	const dirsToDir				= ["-d", TEMPDIR, TEMPDIR, TEMPDIR]
	const dirsToFile			= ["-o", INPUTFILE, TEMPDIR, TEMPDIR]
	// fuckups
	const dirAsFile1			= ["-o", INPUTFILE]
	const dirAsFile2			= ["-o", INPUTFILE]
	const fileAsDir1			= ["-d", TEMPDIR]
	const fileAsDir2			= ["-d", TEMPDIR]
	
	callPath(fileToReplace) 
	// callPath(fileToDir)
	// callPath(fileToFile)
// })
 
/*tap.test("css::transpile postcss file to css", t => {
	t.plan(1)
	
	let actual, expected
	
	const OUTPUTFILE = "postcss/unit.css"
	const COMPILEDFILE = "../fixtures/compiled.css"

	const postcssProcess = postcssHandler([
		"-o",
		path.join(__dirname, OUTPUTFILE),
		INPUTFILE
	])
	
	postcssProcess.on("sent", actual => {
		expected = shell.cat(COMPILEDFILE)
		actual = shell.cat(OUTPUTFILE)
		t.same(actual, expected, `${INPUTFILE} should be the same as ${COMPILEDFILE}`)
		t.end()
	})
})*/

"use strict"

import * as tap from "tap"
import postcssHandler from "../../lib/postcss"
import * as path from "path"
import * as shell from "shelljs"

const INPUTFILE = path.resolve(__dirname, "../fixtures/folder1/postcss.css")

/** argument combinations to postcss
 *	1. "-o outputFile inputFile"											[1]
 *	2. "--output outputFile inputFile"								[1]
 *	3. "-o outputFile inputFile inputFile ..."				[1]
 *	4. "--output outputFile inputFile inputFile ..."	[1]
 *	5. "-d outputDir inputFile"												[1]
 *	6. "--dir outputDir inputFile"										[1]
 *	7. "-d outputDir inputFile inputFile ..."					[1]
 *	8. "--dir outputDir inputFile inputFile"					[1]
 *	9. "-d outputDir inputDir"												[2]
 *	10. "--dir outputDir intputDir"										[2]
 *	11. "-o outputFile inputDir"											[3]
 *	12. "--output outputFile inputDir"								[3]
 *	13. "-o outputDir inputDir"												[4]
 *	14. "--output outputDir inputDir"									[4]
 *	15. "-d outputFile inputDir"											[4]
 *	16. "--dir outputFile intputDir"									[4]
 *	17. "-d outputDir inputDir inputDir ..."					[2]
 *	18. "--dir outputDir inputDir inputDir ..."				[2]
 *	19. "-d outputDir inputDir inputFile ..."					[2]
 *	20. "--dir outputDir inputDir inputFile ..."			[2]
 *	21. "-d outputDir inputDir inputFile ..."					[2]
 *	22. "--dir outputDir inputDir inputFile ..."			[2]
 * ACTIONS:
 * [1] - transpile files to output - direct pass on args to postcss
 * [2] - recursivly transpile all files in dir to output dir while rataining the dir structure
 * [3] - throw new Error("Can not transpile a directory to a file - yet")
 * [4] - throw new Error("output has to be a directory when input is a directory - did you mean to use --dir")
 **/
tap.test("css::transpile postcss file to css", t => {
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
})

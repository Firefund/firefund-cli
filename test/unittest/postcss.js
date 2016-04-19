"use strict";

var _tap = require("tap");

var tap = _interopRequireWildcard(_tap);

var _common = require("../../lib/common");

var _postcss = require("../../lib/postcss");

var _path = require("path");

var path = _interopRequireWildcard(_path);

var _shelljs = require("shelljs");

var shell = _interopRequireWildcard(_shelljs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var INPUTFILE = path.resolve(__dirname, "../fixtures/folder1/postcss.css");
var TEMPDIR = path.resolve(__dirname, "../temp/");
var getOutputFile = function getOutputFile() {
	var counter = 0;
	return function () {
		return counter++;
	};
}();
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
	shell.cp("-f", INPUTFILE, TEMPDIR);
}
tap.test("postcss::call paths", function (t) {
	t.plan(15 + 4);

	//const replaceInputFile = path.resolve("../temp/postcss.css")
	/**
  * format:	[-d|-o, output, input]
  * 					[-r, input]
  */
	var fileToReplace = ["-r", INPUTFILE];
	var fileToDir = ["-d", TEMPDIR, INPUTFILE];
	var fileToFile = ["-o", INPUTFILE, INPUTFILE];
	var dirToReplace = ["-r", INPUTFILE, TEMPDIR];
	var dirToDir = ["-d", TEMPDIR, TEMPDIR];
	var dirToFile = ["-o", TEMPDIR, INPUTFILE];
	var filesToReplace = ["-r", INPUTFILE, INPUTFILE];
	var filesToDir = ["-d", TEMPDIR, INPUTFILE, INPUTFILE];
	var filesToFile = ["-o", INPUTFILE, INPUTFILE, INPUTFILE];
	var mixedToReplace = ["-r", INPUTFILE, TEMPDIR];
	var mixedToDir = ["-d", TEMPDIR, INPUTFILE, TEMPDIR];
	var mixedToFile = ["-o", INPUTFILE, INPUTFILE, TEMPDIR];
	var dirsToReplace = ["-r", TEMPDIR, TEMPDIR];
	var dirsToDir = ["-d", TEMPDIR, TEMPDIR, TEMPDIR];
	var dirsToFile = ["-o", INPUTFILE, TEMPDIR, TEMPDIR];
	// fuckups
	var dirAsFile1 = ["-o", TEMPDIR, TEMPDIR];
	var dirAsFile2 = ["-o", TEMPDIR, INPUTFILE];
	var fileAsDir1 = ["-d", INPUTFILE, TEMPDIR];
	var fileAsDir2 = ["-d", TEMPDIR, INPUTFILE];

	var normalCircumstances = [fileToReplace, fileToDir, fileToFile, dirToReplace, dirToDir, dirToFile, filesToReplace, filesToDir, filesToFile, mixedToReplace, mixedToDir, mixedToFile, dirsToReplace, dirsToDir, dirsToFile];
	var fuckedCircumstances = [dirAsFile1, dirAsFile2, fileAsDir1, fileAsDir2];

	var typesMap = {
		"-r": _postcss.Replace,
		"-d": _postcss.Directory,
		"-o": _postcss.File
	};

	normalCircumstances.forEach(testType);
	fuckedCircumstances.forEach(testType);

	function testType(params) {
		console.time("typeName");
		/* The code is a macro for the following 3 lines
  expected = Replace
  actual = fst( getTypeFromOption(fileToReplace) ).class
  t.equal(actual, expected, "should by of Replace type")
  */
		var expected = getType(typesMap, params[0]),
		    actual = (0, _common.fst)((0, _postcss.getTypeFromOption)(params)).class;
		doTest(actual, expected, expected.name);
	}
	function getType(types, key) {
		return types[key];
	}
	function doTest(actual, expected, typeName) {
		t.equal(actual, expected, "should by of " + typeName + " type");
		console.timeEnd("typeName");
	}
});

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

# firefund-cli
[![Build Status](https://travis-ci.org/Firefund/firefund-cli.svg?branch=master)](https://travis-ci.org/Firefund/firefund-cli)

[![Coverage Status](https://coveralls.io/repos/Firefund/firefund-cli/badge.svg?branch=master&service=github)](https://coveralls.io/github/Firefund/firefund-cli?branch=master)

[![Dependencies Status](https://david-dm.org/Firefund/firefund-cli.svg)](https://david-dm.org/Firefund/firefund-cli)

Command Line Interface (CLI) for Firefund development scripts

List of commands:

- `assets`: Copy dependencies found in [bower.json](http://bower.io/docs/creating-packages/#bowerjson) to a directory specified as first argument
- `server`: Starts an [ecstatic](https://github.com/jfhbrook/node-ecstatic/) server and uses [livereload](http://github.com/napcs/node-livereload/) to watch the directory given as the first argument
- `build`

"use strict"

import path from "path"
const spawn = require("child_process").spawn
require("shelljs/global")

if(!process.env.PHANTOMJS_EXECUTABLE)
  process.env.PHANTOMJS_EXECUTABLE = path.resolve(path.join(__dirname, "../node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs"))

function createChild({ exec = process.execPath, args, env, stdio }) {
  return spawn(exec, args, { env, stdio })
}

const options = {
  exec: require.resolve("../node_modules/casperjs/bin/casperjs"),
  args: [require.resolve("./t")],
  env: process.env,
  stdio: 'pipe'
}
/*const child = exec(require.resolve("../node_modules/.bin/casperjs") + " " + require.resolve("./t"), { env: process.env }, (code, stdout, stderr) => {
  console.log('Exit code:', code);
  console.log('Program output:', stdout);
  console.log('Program stderr:', stderr);
})*/
console.log(process.env.PHANTOMJS_EXECUTABLE)

const child = createChild(options)
child.stdout.on("data", msg => console.log(msg.toString()))
child.stderr.on("data", msg => console.log(msg.toString()))
child.on("exit", code => console.log("Ending with code: %d", code))


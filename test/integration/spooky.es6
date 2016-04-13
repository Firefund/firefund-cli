"use strict"

import Spooky from "spooky"

const spooky = new Spooky({
  child: {
    transport: "http"
  },
  casper: {
    logLevel: "debug",
    verbose: true
  }
}, err => {
  if (err) {
    let e = new Error("Failed to initialize SpookyJS")
    e.details = err
    throw e
  }

  spooky.start("http://localhost:8080")
  spooky.then(function() {
    this.emit("hello", "Hello, from " + this.evaluate(() => document.title))
  })
  spooky.run()
})

spooky.on("error", (e, stack) => {
  console.error(e)
  if(stack) console.log(stack)
})
spooky.on("console", line => {
    console.log(line)
})

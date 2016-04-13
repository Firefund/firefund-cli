"use strict"

const casper = require("casper").create({
    verbose: true,
    logLevel: "debug",
    onPageInitialized: function(page){ this.echo("page re-/load") }
})

casper.open("http://localhost:8080")
  .then(() => this.echo("First load"))

casper.run()

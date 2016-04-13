"use strict";

var casper = require("casper").create({
    verbose: true,
    logLevel: "debug",
    onPageInitialized: function onPageInitialized(page) {
        this.echo("page re-/load");
    }
});

casper.open("http://localhost:8080").then(function () {
    return undefined.echo("First load");
});

casper.run();
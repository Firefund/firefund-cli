#!/usr/bin/env node


"use strict";

var _common = require("../lib/common");

var c = _interopRequireWildcard(_common);

var _postcss = require("../lib/postcss");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var args = c.args;
(0, _postcss.postcssHandler)(args);
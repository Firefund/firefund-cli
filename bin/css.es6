#!/usr/bin/env node

"use strict";

import * as c from "../lib/common"
import { postcssHandler as dispatchToPostcss } from "../lib/postcss"

const args = c.args
dispatchToPostcss(args)

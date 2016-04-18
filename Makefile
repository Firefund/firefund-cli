IN_POSTCSS = test/unittest/postcss.es6 lib/postcss.es6
OUT_POSTCSS = test/unittest/postcss.js lib/postcss.js

$(OUT_POSTCSS): $(IN_POSTCSS)
	npm run babel -- $< --out-file $@

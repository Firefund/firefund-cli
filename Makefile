test/unittest/postcss.js: test/unittest/postcss.es6
	npm run babel -- $? --out-file $%

lib/postcss.js: lib/postcss.es6
	npm run babel -- $? --out-file $%

# OUT_POSTCSS := test/unittest/postcss.js lib/postcss.js 
# IN_POSTCSS := $(OUT_POSTCSS:%.js=%.es6)

# all: $(OUT_POSTCSS)

# $(OUT_POSTCSS): $(IN_POSTCSS)
# 	npm run babel -- $? --out-file $%

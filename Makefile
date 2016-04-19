all: **/*.js
%.js: %.es6
	npm run babel -- $< --out-file $@

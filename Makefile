all:

jshint:
	git ls-tree --name-only -r HEAD | grep \.js$ | xargs ./node_modules/.bin/jshint 

test: clean
	./node_modules/.bin/tap test/

clean:
	find . -name '*~' -exec rm {} ';'

.PHONY: test clean

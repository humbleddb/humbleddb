
all: clean test

clean:
	@rm -rf .coverage_data
	@rm -rf cover_html

node_modules:
	npm install

coverage: node_modules
	@rm -rf .coverage_data
	@rm -rf cover_html
	node_modules/cover/bin/cover run node_modules/mocha/bin/_mocha tests
	node_modules/cover/bin/cover report
	node_modules/cover/bin/cover report html

test: node_modules
	node node_modules/mocha/bin/_mocha tests

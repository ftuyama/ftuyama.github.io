install:
	npm install
	npm install -g simple-autoreload-server

lint:
	npm run eslint

run:
	autoreload-server

test:
	npm test


.PHONY: test

install:
	npm install

lint:
	npm run eslint

optimize:
	`for file in public/images/**/*; do cwebp -q 50 "$file" -o "${file%.*}.webp"; done`
	`for file in public/images/*; do cwebp -q 50 "$file" -o "${file%.*}.webp"; done`

run:
	autoreload-server

test:
	npm test


.PHONY: test

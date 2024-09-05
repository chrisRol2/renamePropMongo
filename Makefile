.PHONY: deps
deps:
	@npm install

.PHONY: build
build:
	@npm run build:bundle

.PHONY: clean
clean:
	@rm -rf build/

.PHONY: fullclean
fullclean: clean
	@rm -rf node_modules/

.PHONY: reinit
reinit: fullclean deps

.PHONY: rundev
rundev:
	@npm run dev

.PHONY: fullrestart
fullrestart: fullclean deps build rundev


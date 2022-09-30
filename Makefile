# Makefile for Beer-garden UI

.PHONY: clean clean-build clean-test help test deps
.DEFAULT_GOAL := help

help:
	$(info Available actions: clean clean-build clean-test help test deps)

deps: ## install javascript dependencies
	npm install

clean-build: ## Remove build
	rm -rf build

clean-all: clean-build ## clean everything
	rm -f npm-debug.log
	rm -f npm-error.log

clean: clean-all ## alias of clean-all

lint: ## check style with eslit
	npm run lint

test: ## run tests
	npm run test

package: clean ## builds distribution
	npm run build

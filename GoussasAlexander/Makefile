usage:
	@echo "Usage: make dayXX"
	@echo "Build a single-file executable with Bun"

day02: day02.ts
	bun build --compile $< --minify --bytecode --outfile $@

day04: day04.ts
	bun build --compile $< --minify --bytecode --outfile $@

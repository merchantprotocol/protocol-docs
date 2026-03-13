# Protocol Documentation Site

# Show available commands
default:
    @just --list

# Install all dependencies
install:
    yarn install

# Start the dev server with hot reload on port 80
start:
    yarn website:start -- --port 80 --host 0.0.0.0

# Build the static site for production
build:
    yarn website:build

# Serve the production build on port 80
serve:
    yarn website:serve -- --port 80 --host 0.0.0.0

# Clean build artifacts and Docusaurus cache
clean:
    cd website && rm -rf build .docusaurus

# Full rebuild from clean state
rebuild: clean build

# Format all source files
format:
    cd website && yarn format:source && yarn format:markdown && yarn format:style

# Lint docs and source
lint:
    cd website && yarn lint

# Clear cache, reinstall, and start fresh
reset: clean
    rm -rf node_modules website/node_modules
    yarn install

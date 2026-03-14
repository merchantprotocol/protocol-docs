# Protocol Documentation Site

# Show available commands
default:
    @just --list

# Open the local dev server in the default browser
open port="80":
    open "http://localhost:{{port}}"

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

# Show changes between current build and last deployed backup
status:
    ./cloudflare.sh status

# Backup the build output
backup:
    ./cloudflare.sh backup

# Verify build completeness
verify:
    ./cloudflare.sh verify

# Deploy to Cloudflare Pages (build + verify + confirm + backup + deploy)
deploy: build
    ./cloudflare.sh deploy

# Deploy a preview branch (build + verify + confirm + backup + deploy)
deploy-preview: build
    ./cloudflare.sh deploy-preview

# List all backups
backups:
    ./cloudflare.sh backups

# Remove all backups
clean-backups:
    ./cloudflare.sh clean-backups

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

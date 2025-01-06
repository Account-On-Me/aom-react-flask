#!/bin/bash

set -x

# style checks rely on commands in path
if ! command -v ruff &> /dev/null || ! command -v dotenv-linter &> /dev/null; then
    echo "Installing linting tools (Ruff, dotenv-linter ...) ..."
    poetry install --only lint
fi

# run ruff linter
poetry run ruff check --fix .

# run ruff formatter
poetry run ruff format .

# run dotenv-linter linter
poetry run dotenv-linter .env.example

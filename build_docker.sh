#!/bin/bash

ENV_FILE=".env"

# Check if the file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: File '$ENV_FILE' not found."
    exit 1
fi

# Read all key-value pairs in a single line split by spaces
LINE=$(grep -v '^#' "$ENV_FILE" | xargs -d '\n')

# Initialize an empty string for build arguments
BUILD_ARGS=""

# Loop through each key-value pair separated by spaces
for pair in $LINE; do
    # Split by '=' to extract key and value
    IFS='=' read -r key value <<< "$pair"

    # Trim key and value
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs)

    # Add the build argument
    BUILD_ARGS+="--build-arg $key=$value "
  done
# Run docker build with all args
echo "Running docker build with args: $BUILD_ARGS"
docker buildx build $BUILD_ARGS -t registry.heroku.com/salty-tor-32110/web:latest .

docker rmi $(docker images -f "dangling=true" -q)
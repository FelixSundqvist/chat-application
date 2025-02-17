#!/bin/bash

# NOTE: Make this more robust if needed
ENV_FILE=".env"
REPOSITORY="FelixSundqvist/chat-application"

# Ensure the GitHub CLI (gh) is installed
if ! command -v gh &> /dev/null; then
  echo "GitHub CLI not found. Please install it from https://cli.github.com/"
  exit 1
fi

# Loop through every variable and add them to gh secrets:

while read -r line || [[ -n "$line" ]]; do
  # Skip empty lines and lines starting with #
  if [[ -z "$line" || "$line" =~ ^# ]]; then
    continue
  fi

  # Split the line into key and value
  IFS="=" read -r key value <<< "$line"

  # Ensure both key and value are not empty
  if [[ -n "$key" && -n "$value" ]]; then
    echo "Adding secret: $key $value"
#    gh secret set "$key" -b"$value" -R "$REPOSITORY"
  else
    echo "Skipping invalid line: $line"
  fi
done < "$ENV_FILE"




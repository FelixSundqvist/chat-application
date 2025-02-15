#!/bin/bash

# NOTE: Make this more robust if needed
KEY="PROD_FRONTEND_ENV"
ENV_FILE="./packages/frontend/.env.build.production"
REPO="FelixSundqvist/chat-application"

# Ensure the GitHub CLI (gh) is installed
if ! command -v gh &> /dev/null; then
  echo "GitHub CLI not found. Please install it from https://cli.github.com/"
  exit 1
fi

# Check if the .env file exists
if [[ ! -f $ENV_FILE ]]; then
  echo ".env file not found at $ENV_FILE"
  exit 1
fi

BASE_64_ENV=$(openssl base64 -A -in $ENV_FILE)

gh secret set "$KEY" -b"$BASE_64_ENV" -R "$REPO"

echo "Secrets updated successfully."
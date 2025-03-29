# Chat application

![Releases](https://github.com/FelixSundqvist/chat-application/actions/workflows/release.yml/badge.svg)

This project is work in progress.

## Description

This is a chat application that allows users to send messages to each other. The application is built using React and Node.js.

This application has features such as: 
 - Realtime chatting
 - Private chat rooms

## Installation

1. Install dependencies:

```bash
  # Install nvm
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
  
  # Install node 22
  nvm install 22
  
  # Set node 22 as default version
  nvm alias default 22
  
  # Install yarn
  npm install --global yarn
 
  # Install Firebase cli
  curl -sL https://firebase.tools | bash
  
  # Login to Firebase
  
  firebase login
  # Install npm packages
  yarn
```
2. Ask for or create `.env` files 
3. Run in dev mode `yarn dev`

## Commits

This repository is using the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for commit messages. This is to ensure that the commit messages are easy to read and understand.

This is enforced by a pre-commit hook that runs `commitlint` on the commit message.

## Project structure

The frontend folder structure follows the [bulletproof-react](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md) project structure.

## Stack

- Frontend:
  - React
  - Typescript
  - Tailwind CSS
  - Shadcn
- Functions:
  - esbuild
- CI/CD:
  - Github Actions
  - Firebase deploy
  - nx
  - Husky
  - Commitlint
- Firebase:
  - Functions
  - Firestore
  - Hosting
  - App check
  - Auth
- Common:
  - Typescript
  - Eslint



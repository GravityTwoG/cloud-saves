# Cloud Saves Desktop application

[![semantic-release: electron](https://img.shields.io/badge/semantic--release-electron-31a0f9?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

Desktop application for management of game saves.

Backend application with REST API is implemented by my friend https://github.com/Ki-Really/GameSavesStore.

## Features

- 🔍 scan file system for game saves
- 🔄 periodically sync saves with server
- ⬇︎ download your/shared/public saves
- 🗃️ extract game state information from files (player level, play time etc)

## Development

Install Git.
Install Node.js from official website or using volta.sh, nvm, fnm.

Install dependencies using command:

```sh
npm install
```

Initialize husky

```sh
npm run prepare
```

Run in dev mode

```sh
npm run start
```

Package app

```sh
npm run package
```

Modules diagram

```sh
npx madge --image graph.svg ./src/renderer.ts
npx madge --image graph.svg ./src/renderer.ts --circular
npx tsuml2 -o out.svg  -g "./src/**/*.ts(x)?"
```

## Folder structure

We use electron as a framework, so application consists of two parts: **"backend"** application which runs on Node.js and **client** application which runs in chromium.

- src - root of source directory
  - @types - global type definitions
  - backend - "backend" application
    - fs - fs utils
    - game-state-parameters - parameter values extraction, game state formats convertion
    - StatesManager - extracts parameter values, archives game state files, downloads game state from the server
    - SyncManager - automatically uploads or downloads game states
    - electron-api.ts - IPC handlers (smth like REST controller)
  - client - client application
    - app - configuration of react application (main layout, routing etc)
    - config - configuration of application (list of pages, their corresponding paths, sidebar links)
    - locales - json files with internationalized texts
    - pages - pages
    - entities - entity specific components
    - shared - reusable domain/app specific code (components, hooks, other utils)
    - ui - ui kit. This layer knows nothing about domain or application as a whole.
    - api - api layer or data access layer (DAL) (work with REST API, electron IPC)
  - preload.ts - Electron preload file
  - renderer.ts - Entry point of client application
  - main.ts - Entry point of a whole application
  - types.ts - Domain specific type definitions
  - Application.ts - Configuration and bootstrap of a whole application

# Cloud Saves Desktop application

[![semantic-release: electron](https://img.shields.io/badge/semantic--release-electron-31a0f9?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

Desktop application for management of game saves.

Features:

- scan file system for game saves
- periodically sync saves with server
- download your/shared/public saves

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
npx madge --image graph.svg .\src\renderer.ts
npx madge --image graph.svg .\src\renderer.ts --circular
npx tsuml2 -o out.svg  -g ".\src\**\*.ts(x)?"
```

## Folder structure

We use electron as a framework, so application consists of two parts: **backend** application which runs on nodejs and **client** application which runs in chromium.

- src - root of source directory
  - @types - global type definitions
  - backend - backend application
    - fs - fs utils
    - game-state-parameters - parameter values extraction, game state formats converting
    - StatesManager - extracts parameter values, archives game state files, downloads game state from the server
    - SyncManager - automatically uploads or downloads game states
    - electron-api.ts - IPC handlers (smth like REST controller)
  - client - client application
    - app - configuration of react application (main layout, routing etc)
    - config - configuration of application (list of pages, their corresponding paths, sidebar links)
    - contexts - React contexts (API, UI)
    - layouts - Reusable layouts of application or pages
    - locales - json files with internationalized texts
    - pages - pages
    - lib - reusable domain/app specific code (components, hooks, other utils)
    - api - api layer (work with REST API, electron IPC)
    - ui - ui kit. This layer knows nothing about domain or application as a whole.
  - preload.ts - Electron preload file
  - renderer.ts - Entry point of client application
  - main.ts - Entry point of a whole application
  - types.ts - Domain specific type definitions
  - Application.ts - Configuration and bootstrap of a whole application

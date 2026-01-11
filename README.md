Single-page Angular app for searching books and managing favorites. It uses Angular 20 with standalone components, routing, and HttpClient. The UI talks to a backend through a local proxy so CORS is not a concern during development.

## Prerequisites

- Node.js 18+ recommended (Angular 20).
- npm.

## Install

bash
npm install


## Run locally

bash
npm start


Open http://localhost:4200.

## Proxy configuration

This frontend uses an Angular dev-server proxy to communicate with the backend API during local development.

- Proxy file: proxy.conf.json.
- Referenced in angular.json at projects.vista-ti-books-frontend.architect.serve.options.proxyConfig.
- Requests to /api/** are forwarded to the backend target defined in the proxy file (default: https://localhost:7094).
- To point to a different backend instance, update the target value inside proxy.conf.json.
- No src/environments/* files or .env configs are present.

### End-to-end tests

Not configured.

## Build

bash
npm run build


## Technical decisions

- Angular 20 with standalone components and @angular/router for navigation.
- HttpClient services for backend communication.
- Dev-server proxy (/api) to avoid CORS during local development.
"

# AI Investigation Assistant

React and TypeScript frontend for the AI Investigation Assistant project. The frontend will provide the interface for submitting technical questions and viewing investigation results.

## Requirements

- Node.js
- npm

## Getting started

Install dependencies and start the Vite development server:

```sh
npm install
npm run dev
```

On Windows, copy the example configuration before starting the dev server:

```powershell
Copy-Item .env.example .env.local
```

The example configuration uses a mock backend, so the chat can be tried without
the API running. To call the real backend, set `VITE_BACKEND_MODE=real` and set
`VITE_API_BASE_URL` in `.env.local` to its origin, for example
`http://127.0.0.1:8000`. These values are included in the frontend build and
must not contain secrets.

## Available scripts

- `npm run dev` starts the local development server.
- `npm run build` runs the TypeScript project checks and creates a production build in `dist/`.
- `npm run lint` checks the source with Oxlint.
- `npm run preview` serves the production build locally.

## Project structure

- `src/main.tsx` creates the React root and renders the application.
- `src/App.tsx` contains the root UI component.
- `src/components/` contains the access and chat UI components.
- `src/services/BackendService.ts` encapsulates requests to the backend.
- `src/services/BackendServiceMock.ts` provides a local mock implementation.
- `vite.config.ts` configures Vite and its React plugin.
- `tsconfig*.json` contains the TypeScript compiler configuration.

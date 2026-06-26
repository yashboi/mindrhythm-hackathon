# Running Mobility Terminal on an accessible host

The app is configured to bind to `0.0.0.0` so it can be reached from outside the container or VM when the platform exposes the port.

## Development server

```bash
npm install
npm run dev
```

By default this starts Next.js on:

```text
http://0.0.0.0:3000
```

If you are inside a cloud workspace, open or forward port `3000` and use the public forwarded URL provided by that workspace.

## Production-style server

```bash
npm install
npm run build
npm run start
```

The `start` and `serve` scripts also bind to `0.0.0.0`.

## Local-only development

If you only want the server on your machine, run:

```bash
npm run dev:local
```

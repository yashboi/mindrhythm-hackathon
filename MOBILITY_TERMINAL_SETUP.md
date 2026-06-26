# Mobility Terminal setup notes

This repository scaffolds a Next.js App Router application with TypeScript, Tailwind CSS, shadcn-style utilities, typed mock data, API route handlers, and terminal UI components.

Detected before scaffolding:
- Next.js app: not present
- App Router: not present
- TypeScript: not present
- Tailwind: not present
- shadcn/ui structure: not present
- `components/ui`: not present
- `@/` alias: not present
- global styles: not present
- package manager: not present; npm was selected by creating `package.json`

To run locally when registry access is available:

```bash
npm install
npm run dev
```

`npm run dev` binds Next.js to `0.0.0.0`, making the app reachable from forwarded or exposed port `3000`. See `SERVER.md` for development and production server commands.

# AGENTS.md

Craft CMS 5 site with a Vite front end, run locally under ddev.

Before changing `package.json` or the lockfile, read the "Dependency updates" section of `CONTRIBUTING.md`.

## Setup

- `node_modules` is shared between the host and the ddev container (Linux). An `npm ci` on a Mac leaves only the macOS esbuild and Rollup binaries, so run `ddev npm ci` before `ddev npm run dev`.
- Commits from before #2 install GSAP from `node_packages/gsap-bonus.tgz`, which is gitignored by `*.tgz`. To check one out, copy the tarball in before `npm ci` (see "HEAD worktree setup" in `CONTRIBUTING.md`).

## Rules

- `vite` belongs in `dependencies`. `npm install --save-dev vite` moves it into `devDependencies`, so bump it with `npm install vite@<version>` or by editing `package.json`.
- `vite.config.mjs` has to stay `.mjs` (see `CONTRIBUTING.md`).

## Gates

There are no tests and no lint. The gates are:

- `npx vite build`, which must pass.
- `npx tsc --noEmit -p .`, which already fails on `main` with two errors: TS7016 in `src/scripts/components/Gallery.ts` and TS2339 in `src/scripts/main.ts`. Any other error is new.

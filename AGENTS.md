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

There is no lint. `.github/workflows/ci.yml` runs the first two on every pull request and on pushes to `main`. The gates are:

- `npx vite build`, which must pass. Run it as `ddev npm run prod` when `node_modules` came from `ddev npm ci`: the host then has only the container's Linux Rollup binary.
- `npx tsc --noEmit -p .`, which must pass with no errors.
- `npm test` on the Mac with ddev running, for changes under `src/scripts` or `templates`. It starts the dev server if it isn't running.

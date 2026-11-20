# Contributing

## Dependency updates

### Read first

- `eslint` is pinned exactly. The pin dates to the initial commit and records no reason.
- None of the lint and format tooling runs. There is no ESLint config and no Prettier config, so `eslint`, `@typescript-eslint/*`, `prettier-plugin-tailwindcss` and `@zackad/prettier-plugin-twig-melody` are never loaded. `fs-extra` is imported nowhere, and `vite-plugin-webfont-dl` is commented out in `vite.config.mjs`.
- `vite.config.mjs` has to stay ESM (`.mjs`). The package has no `"type": "module"`, so a `.js` config is bundled as CommonJS, and the ESM-only plugins (`vite-tsconfig-paths` 5+, `vite-plugin-restart` 1+) then fail to load.
- `vite.config.mjs` sets `esbuild.legalComments` to `"inline"`. From Vite 7.2 the default strips `/*! */` comments, which removes the Glide.js and GSAP license banners from the modern bundle.
- `vite.config.mjs` sets `manifest.theme_color` to `undefined` on purpose. Since 0.21.2, `vite-plugin-pwa` fills in its own default (`#42b883`) when none is set, and the site has never had a theme colour. The build warns that `theme_color` is missing; that is expected.
- `workbox-build` 7.4.1 bundles `sw.js` with `@trickfilm400/rollup-plugin-off-main-thread@3.0.0-pre1`, an unsigned pre-release fork of `@surma/rollup-plugin-off-main-thread` published by one person and adopted upstream in GoogleChrome/workbox#3446. Its runtime files were diffed against `@surma` 2.2.3 in October 2026 and matched apart from line endings and one URL in an error message. Diff the tarballs again when Workbox moves to another version (GoogleChrome/workbox#3579).
- `typescript` is a direct devDependency because the typecheck gate below depends on it. Keep it when removing `@typescript-eslint/*`.
- The repository requires SHA-pinned actions, so `.github/workflows/ci.yml` pins `actions/checkout` and `actions/setup-node` by commit SHA with the version in a trailing comment. A tag there fails the run. Dependabot bumps them (`.github/dependabot.yml`); `ncu` does not read workflow files. To pin one by hand: `gh api repos/actions/<name>/git/ref/tags/<tag> -q .object.sha`.

### Setup

- `.npmrc` sets `min-release-age=7`. npm applies it from 11.10 on, while Node 22 ships npm 10, so run updates with npm 11.10 or later. `npm ci` ignores the gate, so the deploy build is unaffected.
- Vite 7 needs Node 20.19+ or 22.12+. `.nvmrc` says `22`, so the Node 22 that `nvm use` picks on the server has to be 22.12 or later.
- npm-check-updates does not read `min-release-age`. Pass `--cooldown 7`.
- `.github/dependabot.yml` runs Dependabot for GitHub Actions only, weekly, with a 7-day cooldown to match `min-release-age`. It opens one grouped `ci(deps)` pull request, which has to pass the `gates` check like any other. npm updates stay manual: see "ncu flags". Dependabot alerts and its automated security fixes are both off for the repository, which does not affect these version updates.
- `allowScripts` in `package.json` approves `esbuild`'s postinstall by exact version, so re-review it when esbuild moves. `core-js` (a funding banner), `@parcel/watcher` (builds from source only when asked) and `fsevents` (ships a prebuilt binary) are denied for every version.

### ncu flags

- `--cooldown 7` on every run.
- Holds:
  - `vite` stays on major 7 until `vite-plugin-restart` supports Vite 8 (antfu/vite-plugin-restart#32). `@vitejs/plugin-legacy` follows Vite's major, so it moves with `vite` in the same install.
- `--peer --format group` with `--cooldown` can leave rows out. Check the newest version past the gate per package rather than trusting the grouped list.

### Gates per stage

There is no lint script and there are no git hooks. `.github/workflows/ci.yml` runs `npm ci`, `npx tsc --noEmit -p .` and `npx vite build` on every pull request and on pushes to `main`. The Playwright run stays local until #22. The gates are:

- `npx vite build`, which must pass. On the Mac run it as `ddev npm run prod` once `ddev npm ci` has installed the container's binaries (see "Manual checks").
- `npx tsc --noEmit -p .`, which must pass with no errors.
- `npm test` on the Mac with ddev running, for changes under `src/scripts` or `templates`. It starts the dev server if it isn't running. It runs the installed Chrome (`channel: "chrome"` in `playwright.config.ts`), so `npx playwright install` is never needed.

The first two can run at the same time.

### HEAD worktree setup

```sh
git worktree add <dir> main
cd <dir> && npm ci
```

Commits before GSAP moved to the public npm package install it from `node_packages/gsap-bonus.tgz`, which is gitignored. For those, copy the tarball in from an existing checkout before `npm ci`: `mkdir -p <dir>/node_packages && cp node_packages/gsap-bonus.tgz <dir>/node_packages/`.

The build reads no `VITE_` variables, so it needs no `.env`.

### Clean-tree CI replay

CI (`.github/workflows/ci.yml`) covers the npm half on a clean Ubuntu runner: `npm ci`, `tsc` and `vite build`. It does not check the server's Node version, and the deploy reads no check status — `build.sh` deploys whatever `git pull` brings — so a green run is not a gated deploy. The deploy runs `build.sh` on the server: `npm ci`, then `composer install` and the Craft migrations, then `npm run prod`. To replay the npm half locally, make a fresh worktree of the branch and run `npm ci && npm run prod`.

### After bumping X

- **Vite, `@vitejs/plugin-legacy`, `vite-plugin-pwa`, `vite-plugin-compression`, `tailwindcss` or `@tailwindcss/vite`:** build on the HEAD worktree and on the branch, and compare `web/dist`. Craft reads `web/dist/.vite/manifest.json` (`config/vite.php`), so the manifest has to stay at that path with the `src/scripts/main.ts` entry.
- **`vite-plugin-pwa`:** check `web/dist/sw.js`, its precache list, `registerSW.js` and `manifest.webmanifest`.
- **`vite-plugin-restart`:** with the dev server running, edit a `.twig` file and confirm the page reloads.
- **`@playwright/test`:** run `npm test`.

### Per-commit steps

None beyond `npm ci`.

### Manual checks

- `node_modules` is shared between the host and the ddev container (Linux). An `npm ci` on a Mac installs only the macOS builds of esbuild and Rollup, and `ddev npm run dev` then fails until `ddev npm ci` adds the Linux ones. The lockfile already lists both, so this changes no files.
- Dev server: `ddev start && ddev npm run dev`, open the site, and check that styles and scripts load, the Glide gallery and GSAP animations run, and a `.twig` edit reloads the page.
- Production build: `ddev npm run prod`, then set `CRAFT_ENVIRONMENT` in `.env` to anything other than `dev` so that Craft serves `web/dist` instead of the dev server. Check the same pages, the service worker registering in devtools, and the legacy bundle loading in a browser without module support if one is handy. Set `CRAFT_ENVIRONMENT` back afterwards.

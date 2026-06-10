# Security Audit: plugins-client-sdk

Repository: `@staffbase/plugins-client-sdk` (v3.0.0-alpha.4)
Package manager: Yarn Classic 1.22.19 (`yarn audit`; repo has no pnpm lockfile)
Date: 2026-06-10

## Summary

| Severity | Before | After |
|----------|--------|-------|
| Critical | 0  | 0 |
| High     | 4  | 0 |
| Moderate | 36 | 0 |
| Low      | 14 | 0 |
| **Total**| **54** | **0** |

12 unique advisories, all in **devDependencies** (build, test and docs tooling), all transitive.
Runtime dependencies (`loglevel`, `object.entries-ponyfill`) had no advisories.
The published package ships only `dist/` (pre-built), so none of these reach SDK consumers.
All issues were resolved by pinning patched versions via Yarn `resolutions`.

## Resolution

Added to the `resolutions` block in `package.json`:

```json
"@babel/plugin-transform-modules-systemjs": "^7.29.4",
"serialize-javascript": "^7.0.5",
"underscore": "^1.13.8",
"eslint/ajv": "^6.14.0",
"@eslint/eslintrc/ajv": "^6.14.0",
"brace-expansion": "^2.0.3",
"js-yaml": "^4.1.1",
"markdown-it": "^14.1.1",
"ws": "^8.20.1",
"esbuild": "^0.25.0",
"@tootallnate/once": "^2.0.1"
```

## Per-advisory decisions (all = RESOLVED)

| Pkg | Sev | Advisory | Path | Patched | Decision |
|-----|-----|----------|------|---------|----------|
| @babel/plugin-transform-modules-systemjs | High | GHSA-fv7c-fp4j-7gwp (CVE-2026-44728) arbitrary code on malicious input | @babel/preset-env | 7.29.4 | Resolved (resolution) |
| serialize-javascript | High | GHSA-5c6j-r48x-rmvq RCE via RegExp.flags | @rollup/plugin-terser | 7.0.5 | Resolved (resolution) |
| serialize-javascript | Mod | GHSA-qj8w-gfj5-8c6v (CVE-2026-34043) CPU exhaustion DoS | @rollup/plugin-terser | 7.0.5 | Resolved (same bump) |
| underscore | High | GHSA-qpx9-hpmf-5gmw (CVE-2026-27601) unbounded recursion DoS | jsdoc | 1.13.8 | Resolved (resolution) |
| ajv | Mod | GHSA-2g4f-4pwh-qvx6 (CVE-2025-69873) ReDoS via `$data` | eslint | 6.14.0 | Resolved (scoped resolution on eslint/eslintrc only; commitlint keeps ajv v8 to avoid the addKeyword API break) |
| brace-expansion | Mod | GHSA-f886-m6hf-6m8v (CVE-2026-33750) zero-step sequence hang | minimatch/glob | 2.0.3 | Resolved (resolution) |
| brace-expansion | Low | GHSA-v6h2-p8h4-qcjw (CVE-2025-5889) ReDoS | minimatch/glob | 2.0.3 | Resolved (same bump) |
| js-yaml | Mod | GHSA-mh29-5h37-fv8m (CVE-2025-64718) prototype pollution in merge | eslint, commitlint | 4.1.1 | Resolved (resolution) |
| markdown-it | Mod | GHSA-38c4-r59v-3vqw (CVE-2026-2327) ReDoS | jsdoc | 14.1.1 | Resolved (resolution) |
| ws | Mod | GHSA-58qx-3vcg-4xpx (CVE-2026-45736) uninitialized memory disclosure | jest-environment-jsdom/jsdom | 8.20.1 | Resolved (resolution) |
| esbuild | Mod | GHSA-67mh-4wv8-2f99 dev server SSRF/CORS | @size-limit/esbuild | 0.25.0 | Resolved (resolution); size-limit verified working |
| @tootallnate/once | Low | GHSA-vpq2-c234-7xj6 (CVE-2026-3449) incorrect control flow | jsdom/http-proxy-agent | 2.0.1 | Resolved (2.0.0 -> 2.0.1 patch) |

## Verification

After applying resolutions and reinstalling:

- `yarn audit` -> 0 vulnerabilities (all severities)
- `yarn lint` (eslint + size-limit) -> pass; bundle 6.88 kB / 8 kB limit
- `yarn test-unit` -> 52 passed, 6 suites
- `yarn build` -> all 4 dist bundles produced

Changed files: `package.json`, `yarn.lock`.

## Notes

- The esbuild bump (0.24 -> 0.25) is a minor-version major-ish jump for that tool; confirmed
  safe because `size-limit` (its only consumer here) runs cleanly.
- All findings were dev-only and never bundled into `dist/`, so consumer-facing risk was already
  nil; the resolutions keep the dev/CI toolchain clean going forward.

# Packages

## Notice

The `@material-ui/pickers` package pins the version of `@date-io/date-fns`
being used.

## Status

Status of running `yarn outdated` as of 02/07/2020. See
[Upgrade Decisions](#upgrade-decisions) below.

```console
Package                     Current Wanted Latest
@date-io/date-fns           1.3.13  1.3.13 2.2.0
@testing-library/jest-dom   4.2.4   4.2.4  5.1.1
@testing-library/user-event 7.2.1   7.2.1  8.1.0
path-to-regexp              1.8.0   1.8.0  6.1.0
query-string                5.1.1   5.1.1  6.10.1
```

## Upgrade Decisions

---

## @date-io/date-fns

Staying on `^1.3.0` since that is the exact devDependency used by package
package `@material-ui/pickers` version `3.2.10`.
See [github.com](https://github.com/mui-org/material-ui-pickers/blob/v3.2.10/lib/package.json#L78)

## @testing-library/jest-dom and @testing-library/user-event

These were setup by create-react-app. Do not upgrade until an upgrade to
create-react-app instructs the developer to do so.

### path-to-regexp

Staying on `1.8.0` since `react-router@5.1.0` (_the latest_), still depends on
`path-to-regexp@^1.7.0` and upgrading `path-to-regexp` would cause our routing
tools to be incompatible with `react-router`.
See [github.com](https://github.com/ReactTraining/react-router/blob/v5.1.2/packages/react-router/package.json#L48)

### query-string

Not using `query-string@6.10.1` because they dropped support for IE and "older
browsers":

> This module targets Node.js 6 or later and the latest version of Chrome,
> Firefox, and Safari. If you want support for older browsers, use version 5:
> `npm install query-string@5.` - [sindresorhus/query-string](https://github.com/sindresorhus/query-string#install)

## Warnings When Installing Packages

---

> warning "react-scripts > eslint-config-react-app@5.2.0" has incorrect peer dependency "eslint-plugin-flowtype@3.x".

- caused by `react-scripts`, not our code.

> warning "react-scripts > @typescript-eslint/eslint-plugin > tsutils@3.17.1" has unmet peer dependency "typescript@>=2.8.0 || >= 3.2.0-dev || >= 3.3.0-dev || >= 3.4.0-dev || >= 3.5.0-dev || >= 3.6.0-dev || >= 3.6.0-beta || >= 3.7.0-dev || >= 3.7.0-beta".

- Typescript is optional for `react-scripts`. To enable it you install
  `typescript` which would fix this warning.

> warning " > @testing-library/user-event@7.2.1" has unmet peer dependency "@testing-library/dom@>=5"

- The `@testing-library/user-event` was installed by `npx create-react-app` so,
  don't worry about this warning until if/when you need it for automated tests.

# Packages

## Notice

The `@material-ui/pickers` package pins the version of `@date-io/date-fns`
being used.

## Status

Status of running `yarn outdated` as of 02/05/2020.

```console
Package                     Current Wanted Latest
@date-io/date-fns           1.3.13  1.3.13 2.2.0
@testing-library/jest-dom   4.2.4   4.2.4  5.1.1
@testing-library/user-event 7.2.1   7.2.1  8.1.0
path-to-regexp              1.8.0   1.8.0  6.1.0
query-string                5.1.1   5.1.1  6.10.1
redux-persist               5.10.0  5.10.0 6.0.0
```

## Upgrade Decisions

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

### redux-persist

Staying on `5.10.0` for now since `6.0.0` is too new; needs to be tested...

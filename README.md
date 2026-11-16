# plugins-client-sdk

[![Build Status](https://github.com/Staffbase/plugins-client-sdk/workflows/Continuous%20Integration/badge.svg?branch=main)](https://github.com/Staffbase/plugins-client-sdk/actions)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

The Plugin Client SDK lets your Staffbase plugin retrieve app information and
invoke app functionality through an asynchronous JavaScript API.

## Documentation

- [Getting started](docs/getting-started.md)
- [App information](docs/app-information.md)
- [Native methods](docs/native-methods.md)
- [API reference](docs/api.md)

## Installation

Install the SDK from [npm](https://www.npmjs.com/package/@staffbase/plugins-client-sdk):

```shell
yarn add @staffbase/plugins-client-sdk
```

## Contribution

- Fork it
- Create a branch with `git checkout -b feature-description`
- Put your name into `AUTHORS.txt`
- Commit your changes
  - Use the Conventional Commits format; a Husky-managed hook validates commit messages
- Push the branch with `git push origin feature-description`
- Open a pull request

## Running tests

Run the unit tests from the repository root with `yarn jest`.

## License

Copyright 2024 Staffbase SE.

Licensed under the Apache License, Version 2.0:
<http://www.apache.org/licenses/LICENSE-2.0>

# plugins-client-sdk 
[![Build Status](https://travis-ci.org/Staffbase/plugins-client-sdk.svg?branch=master)](https://travis-ci.org/Staffbase/plugins-client-sdk)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

If you are developing your own plugin for your Staffbase app you may want your plugin to communicate with our clients.
In order to make this possible we implemented a Javascript based API and communication layer for all our apps.
We want to provide a library to help you improve your plugin functionality.
This SDK provides the basic functionality to get information provided by the Staffbase app to your plugin and trigger application events.

## Installation

We provide our Plugin Client SDK via [npm](https://www.npmjs.com/package/@staffbase/plugins-client-sdk). 
Thus, you can just use yarn for installation:

```
yarn add @staffbase/plugins-client-sdk
```


## API Reference

Please look into our [API documentation](https://github.com/Staffbase/plugins-client-sdk/blob/master/doc/api.md)

## Usage

Please look into our [Usage documentation](https://github.com/Staffbase/plugins-client-sdk/blob/master/doc/usage.md)


## Contribution

- Fork it
- Create a branch `git checkout -b feature-description`
- Put your name into AUTHORS.txt
- Commit your changes
    - As this repository is commitizen friendly you may use `yarn git-cz` to create a commit
    - Your commit message is validated with a husky managed githook
- Push to the branch `git push origin feature-description`
- Open a Pull Request


## Running Tests

To run the tests a simple `# yarn jest` command in the root directory will suffice.

## License

Copyright 2018 Staffbase GmbH.

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0

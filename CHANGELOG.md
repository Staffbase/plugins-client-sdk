## [1.0.2](https://github.com/Staffbase/plugins-client-sdk/compare/v1.0.1...v1.0.2) (2018-09-04)


### Bug Fixes

* **release:** adds build step to release builded files ([ee0c9a6](https://github.com/Staffbase/plugins-client-sdk/commit/ee0c9a6))

## [1.0.1](https://github.com/Staffbase/plugins-client-sdk/compare/v1.0.0...v1.0.1) (2018-08-31)


### Bug Fixes

* **main:** adds missing arguments ([57baa11](https://github.com/Staffbase/plugins-client-sdk/commit/57baa11))
* **travis:** appends token line to npmrc ([5cb2825](https://github.com/Staffbase/plugins-client-sdk/commit/5cb2825))
* **travis:** remove before install ([6ef5a51](https://github.com/Staffbase/plugins-client-sdk/commit/6ef5a51))


### Reverts

* This reverts commit cd22e036692ce0b16141e2c0f40602528b6440f6 ([34f1729](https://github.com/Staffbase/plugins-client-sdk/commit/34f1729))

# [1.0.0]
Initial Release

### Features

#### Device informations

1. `getAppVersion` -> string
2. `isNativeApp` -> boolean
3. `isMobileApp` -> boolean
4. `isAndroidDevice` -> boolean
5. `isIosDevice` -> boolean
6. `deviceCanDownload` -> boolean

#### Language information

1. `getBranchLanguages` -> object
2. `getBranchDefaultLanguage` -> object
3. `getContentLanguages` -> object

#### Invoke native methods

1. `getPreferredContentLocale` {locales: object|array} -> string
2. `openLink` {url: string} -> boolean
3. `openLinkExternal` {url: string} -> boolean
4. `openLinkInternal` {url: string} -> boolean
5. `openNativeFileDialog` -> Blob **!experimental**

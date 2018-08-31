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



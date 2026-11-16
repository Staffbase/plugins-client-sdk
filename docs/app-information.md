# App information

The SDK can retrieve device and language information from the Staffbase app.
These methods return promises; see [Getting started](getting-started.md) for
request examples.

## Device information

| Method | Return value | Description |
| --- | --- | --- |
| `getAppVersion` | `string` | The app version. |
| `isNativeApp` | `boolean` | Whether the plugin is running in the native app. |
| `isMobileApp` | `boolean` | Whether the app is opened in a mobile browser. |
| `isAndroidDevice` | `boolean` | Whether the device is Android. |
| `isIosDevice` | `boolean` | Whether the device is iOS. |
| `deviceCanDownload` | `boolean` | Whether the device can download files. |

## Language information

| Method | Return value | Description |
| --- | --- | --- |
| `getBranchLanguages` | `object` | Languages enabled in the admin settings. |
| `getBranchDefaultLanguage` | `object` | The language set as the default. |
| `getContentLanguages` | `object` | Languages supported by the app. |
| `getUserContentLocale` | `string` | The current user's content locale, falling back to the branch default. |

Language objects include the language key, locale, name, and a localized name.
For example:

```js
{
  de: {
    key: 'de',
    locale: 'de_DE',
    name: 'Deutsch',
    localized: 'German'
  },
  en: {
    key: 'en',
    locale: 'en_US',
    name: 'English',
    localized: 'English'
  }
}
```

`getUserContentLocale` resolves with a locale string:

```js
getUserContentLocale().then(function (locale) {
  console.log(locale); // e.g. 'de_DE'
});
```

## Instance information

`getInstanceUrl` resolves with the frontend URL of the Staffbase instance:

```js
getInstanceUrl().then(function (url) {
  console.log(url); // e.g. 'https://customer.staffbase.com'
});
```

See the [API reference](api.md) for details about each method.

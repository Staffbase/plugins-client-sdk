# Documentation
## What is the Plugin Client SDK
This SDK is a toolchain that helps a developer to access internal informations or invoke native methods of the Staffbase App. The main usages are:
- get device informations
- get languages and localizations
- open links in the app browser or device browser


## Installation
The Plugin Client SDK is designed to be included as easy as possible and doesn't need any custom configuration

### Install Plugin Client SDK
1. Add the Plugin Client SDK to your project:

```shell
npm install --save @staffbase/plugin-client-sdk
```

2. Import the whole SDK or a required method in your script:

```js
// ES6 Syntax supports tree shaking
import * as PluginSDK from '@staffbase/plugin-client-sdk';
import { openLink } from '@staffbase/plugin-client-sdk';

// Common JS
var PluginSDK = require('@staffbase/plugin-client-sdk');
var openLink = require('@staffbase/plugin-client-sdk').openLink;
```

You can load the SDK direct in your page, all available methods are then available from the `window['plugins-client-sdk']` object.

```html
<!-- ... other HTML ... -->
<!-- Load Plugins Client SDK. -->
<script src="https://unpkg.com/@staffbase/plugins-client-sdk" crossorigin></script>

<script>
    var PluginSDK = window['plugins-client-sdk'];
    var openLink = window['plugins-client-sdk'].openLink;
</script>
</body>
```

## Usage guide
The Plugin Client SDK uses an asynchronous communication between the plugin and the Staffbase app. So the whole interface is asynchronous as well. 

> We recommend to request data always on demand with the SDK methods!

### General flow
Every SDK method returns a promise, which resolves with the requested information or throws an error if something breaks.

```js
PluginSDK.isIosDevice().then(function(isIOS) {
    console.log('IOS Device: ', isIOS);
}).catch(function(error) {
    console.warn('Something went wrong: ', error)
})
```

To get multiple informations at once, you can use `Promise.all`.

```js
Promise.all([PluginSDK.isIosDevice(), PluginSDK.isNativeApp()])
        .then(function(isIOS, isNative) {
            console.log('IOS Device: ', isIOS);
            console.log('Native App: ', isNative);
        })
        .catch(function(error) {
            console.warn('Something went wrong: ', error)
        })
```

### Getting infos from the Staffbase app
As a developer you can request various informations from the Staffbase app.

#### Device information

1. `getAppVersion` -> string
   
   the version number of the app

2. `isNativeApp` -> boolean
   
   indicates if the native app is used

3. `isMobileApp` -> boolean
   
   indicates if the app is opened in a mobile browser

4. `isAndroidDevice` -> boolean
   
   indicates if an android device is used

5. `isIosDevice` -> boolean
   
   indicates if an IOS device is used

6. `deviceCanDownload` -> boolean
   
   indicates if device is able to download files

#### Language information

1. `getBranchLanguages` -> object
   
   the languages, which are chosen in the admin settings

   ```js
   // example for german and english in an english app
   {
       de: {
           key: 'de',
           locale: 'de_DE',
           name: 'Deutsch',
           localized: 'German' // this depends on the app language
       },
        en: {
           key: 'en',
           locale: 'en_US',
           name: 'English',
           localized: 'English' // this depends on the app language
       }
   }
   ```

1. `getBranchDefaultLanguage` -> object
   
   the language which is set as default language

   ```js
   // example for german in an english app
   {
           key: 'de',
           locale: 'de_DE',
           name: 'Deutsch',
           localized: 'German' // this depends on the app language
    }
   ```
   
1. `getContentLanguages` -> object
   
   all languages which are supported by the app

   ```js
   // example for german and english in an english app
   {
       de: {
           key: 'de',
           locale: 'de_DE',
           name: 'Deutsch',
           localized: 'German' // this depends on the app language
       },
        ...
   }
   ```
   

### Invoking native methods
With the SDK you can invoke methods, which are in the scope of the native app.

1. `getPreferredContentLocale` {locales: object|array} -> string
   
   checks a given list of locale tags, or an object with locale tags as keys and returns the matching locale tag as string.

   ```js
    const localesArray = ['de_DE', 'en_US'];
    const localesObject = { 'de_DE': {}, 'en_US':{} };

    getPreferredContentLocale(localesArray).then(function (locale) {
        console.log(locale); // 'en_US'
    })

    getPreferredContentLocale(localesObject).then(function (locale) {
        console.log(locale); // 'en_US'
    })
   ```

2. `openLink` {url: string} -> boolean
   
   open a link in the app, supports internal and external links. Returns a boolean
   which indicates if the link has been opened. This can be used to call the method in a click event

   ```js
    // internal link
    openLink('/settings/password').then(function (opened) {
        console.log(opened); // true
    })

    // external link
    openLink('https://staffbase.com').then(function (opened) {
        console.log(opened); // true
    })
   ```

3. `openLinkExternal` {url: string} -> boolean
   
   open a link in the device browser. Returns a boolean which indicates if the link has been opened. This can be used to call the method in a click event

   ```js
    // external link
    openLinkExternal('https://staffbase.com').then(function (opened) {
        console.log(opened); // true
    })
   ```

3. `openLinkInternal` {url: string} -> boolean
   
   open a link in the app browser. Returns a boolean which indicates if the link has been opened. This can be used to call the method in a click event

   ```js
    // external link
    openLinkInternal('https://staffbase.com').then(function (opened) {
        console.log(opened); // true
    })
   ```

4. `openNativeFileDialog` -> Blob **!experimental**
   
   open a native file upload dialog, which is currently only needed for Android devices.
   After the file has been chosen, the data is returned as a blob.

   > Attention! Currently the promise also rejects, if the user cancels the file upload dialog!

   > Attention! This function is still in development and will have a changed behavior in the future!

   ```js
    openNativeFileDialog().then(function (res) {
		console.log('Fileurl: ' + URL.createObjectURL(res)); // blob:d3958f5c-0777-0845-9dcf-2cb28783acaf
	});
   ```

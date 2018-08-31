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


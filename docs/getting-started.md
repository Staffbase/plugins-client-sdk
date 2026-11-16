# Getting started

## Installation

Install the SDK from [npm](https://www.npmjs.com/package/@staffbase/plugins-client-sdk):

```shell
yarn add @staffbase/plugins-client-sdk
```

Import the whole SDK or only the methods you need:

```js
// ES modules support tree shaking.
import * as PluginSDK from '@staffbase/plugins-client-sdk';
import { openLink } from '@staffbase/plugins-client-sdk';

// CommonJS
var PluginSDK = require('@staffbase/plugins-client-sdk');
var openLink = require('@staffbase/plugins-client-sdk').openLink;
```

You can also load the SDK directly in a page. Its methods are then available
from the `window['plugins-client-sdk']` object:

```html
<script src="https://unpkg.com/@staffbase/plugins-client-sdk" crossorigin></script>
<script>
  var PluginSDK = window['plugins-client-sdk'];
  var openLink = window['plugins-client-sdk'].openLink;
</script>
```

## Asynchronous requests

Communication between a plugin and the Staffbase app is asynchronous. SDK
methods return promises that resolve with the requested information or reject
when an error occurs. Request data on demand.

```js
PluginSDK.isIosDevice()
  .then(function (isIOS) {
    console.log('iOS device:', isIOS);
  })
  .catch(function (error) {
    console.warn('Something went wrong:', error);
  });
```

Use `Promise.all` to request multiple values at once:

```js
Promise.all([PluginSDK.isIosDevice(), PluginSDK.isNativeApp()])
  .then(function ([isIOS, isNative]) {
    console.log('iOS device:', isIOS);
    console.log('Native app:', isNative);
  })
  .catch(function (error) {
    console.warn('Something went wrong:', error);
  });
```

See the [API reference](api.md) for all available methods.

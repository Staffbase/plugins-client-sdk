# Native methods

The SDK can invoke methods in the Staffbase app. Calls are asynchronous and
return promises.

## Choose a content locale

`getPreferredContentLocale` checks an array of locale tags or an object whose
keys are locale tags, then resolves with the matching locale:

```js
getPreferredContentLocale(['de_DE', 'en_US']).then(function (locale) {
  console.log(locale); // e.g. 'en_US'
});

getPreferredContentLocale({ de_DE: {}, en_US: {} }).then(function (locale) {
  console.log(locale); // e.g. 'en_US'
});
```

## Open links

`openLink` lets the app choose how to open a link. Use `openLinkExternal` to
open it in the device browser or `openLinkInternal` to open it in the app
browser. Each method resolves with a boolean indicating whether the link was
opened.

```js
openLink('/settings/password').then(function (opened) {
  console.log(opened); // true if opened
});

openLinkExternal('https://staffbase.com').then(function (opened) {
  console.log(opened);
});

openLinkInternal('https://staffbase.com').then(function (opened) {
  console.log(opened);
});
```

## Share content

`openNativeShareDialog` opens the native sharing interface. It is available on
native apps above version 4.0.0. The content object can include an image,
subject, text, or URL.

```js
openNativeShareDialog({
  image: 'https://example.com/test.png',
  subject: 'A subject for the share',
  text: 'This text is shared',
  url: 'https://example.com'
});
```

## Select a file

`openNativeFileDialog` opens the native file chooser and resolves with the
selected file as a `Blob`. It is currently intended for Android. The promise
also rejects if the user cancels the dialog, and the behavior is experimental.

```js
openNativeFileDialog().then(function (file) {
  console.log(URL.createObjectURL(file));
});
```

See the [API reference](api.md) for details about each method.

## Constants

<dl>
<dt><a href="#openNativeShareDialog">openNativeShareDialog</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Open a share dialog on native devices</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#deviceCanDownload">deviceCanDownload()</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Check if device is able to perform a download.</p>
</dd>
<dt><a href="#isIosDevice">isIosDevice()</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Check if device is using ios.</p>
</dd>
<dt><a href="#isAndroidDevice">isAndroidDevice()</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Check if device is using android.</p>
</dd>
<dt><a href="#getAppVersion">getAppVersion()</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Get the version of the Staffbase App.</p>
</dd>
<dt><a href="#isNativeApp">isNativeApp()</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Check if app is native.</p>
</dd>
<dt><a href="#isMobileApp">isMobileApp()</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Check if app is mobile.</p>
</dd>
<dt><a href="#openLink">openLink(url)</a> ⇒ <code>Promise.&lt;any&gt;</code></dt>
<dd><p>Open a link through the app.</p>
<p>Where Staffbase decides which browser (External/Internal)
should be used.</p>
</dd>
<dt><a href="#openLinkExternal">openLinkExternal(url)</a> ⇒ <code>Promise.&lt;any&gt;</code></dt>
<dd><p>Open a link explicitly in the external browser.</p>
</dd>
<dt><a href="#openLinkInternal">openLinkInternal(url)</a> ⇒ <code>Promise.&lt;any&gt;</code></dt>
<dd><p>Open a link explicitly in the internal browser.</p>
</dd>
<dt><a href="#getBranchLanguages">getBranchLanguages()</a> ⇒ <code>Promise.&lt;any&gt;</code></dt>
<dd><p>Get all enabled content languages configured in the app.</p>
</dd>
<dt><a href="#getBranchDefaultLanguage">getBranchDefaultLanguage()</a> ⇒ <code>Promise.&lt;any&gt;</code></dt>
<dd><p>Get the default content language configured in the app.</p>
</dd>
<dt><a href="#getContentLanguages">getContentLanguages()</a> ⇒ <code>Promise.&lt;any&gt;</code></dt>
<dd><p>Get all content languages supported by the app.</p>
</dd>
<dt><a href="#getPreferredContentLocale">getPreferredContentLocale(content)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Gets the chosen language from a given content object</p>
</dd>
<dt><a href="#getUserContentLocale">getUserContentLocale()</a> ⇒ <code>Promise.&lt;any&gt;</code></dt>
<dd><p>Get the current user&#39;s content locale, fallback to branch default locale</p>
</dd>
</dl>

<a name="openNativeShareDialog"></a>

## openNativeShareDialog ⇒ <code>Promise.&lt;string&gt;</code>
Open a share dialog on native devices

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>object</code> | the content to share |

**Example**  
```js
openNativeShareDialog({
     image: "https://example.com/test.png",
     subject: "The string you would like to use as a subject for the share",
     text: "This text is shared",
     url: "https://example.com"
  })
```
<a name="deviceCanDownload"></a>

## deviceCanDownload() ⇒ <code>Promise.&lt;boolean&gt;</code>
Check if device is able to perform a download.

**Kind**: global function  
<a name="isIosDevice"></a>

## isIosDevice() ⇒ <code>Promise.&lt;boolean&gt;</code>
Check if device is using ios.

**Kind**: global function  
<a name="isAndroidDevice"></a>

## isAndroidDevice() ⇒ <code>Promise.&lt;boolean&gt;</code>
Check if device is using android.

**Kind**: global function  
<a name="getAppVersion"></a>

## getAppVersion() ⇒ <code>Promise.&lt;string&gt;</code>
Get the version of the Staffbase App.

**Kind**: global function  
<a name="isNativeApp"></a>

## isNativeApp() ⇒ <code>Promise.&lt;boolean&gt;</code>
Check if app is native.

**Kind**: global function  
<a name="isMobileApp"></a>

## isMobileApp() ⇒ <code>Promise.&lt;boolean&gt;</code>
Check if app is mobile.

**Kind**: global function  
<a name="openLink"></a>

## openLink(url) ⇒ <code>Promise.&lt;any&gt;</code>
Open a link through the app.

Where Staffbase decides which browser (External/Internal)
should be used.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | the url to open in the browser |

<a name="openLinkExternal"></a>

## openLinkExternal(url) ⇒ <code>Promise.&lt;any&gt;</code>
Open a link explicitly in the external browser.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | the url to open in the browser |

<a name="openLinkInternal"></a>

## openLinkInternal(url) ⇒ <code>Promise.&lt;any&gt;</code>
Open a link explicitly in the internal browser.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | the url to open in the browser |

<a name="getBranchLanguages"></a>

## getBranchLanguages() ⇒ <code>Promise.&lt;any&gt;</code>
Get all enabled content languages configured in the app.

**Kind**: global function  
<a name="getBranchDefaultLanguage"></a>

## getBranchDefaultLanguage() ⇒ <code>Promise.&lt;any&gt;</code>
Get the default content language configured in the app.

**Kind**: global function  
<a name="getContentLanguages"></a>

## getContentLanguages() ⇒ <code>Promise.&lt;any&gt;</code>
Get all content languages supported by the app.

**Kind**: global function  
<a name="getPreferredContentLocale"></a>

## getPreferredContentLocale(content) ⇒ <code>Promise.&lt;string&gt;</code>
Gets the chosen language from a given content object

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>object</code> \| <code>array</code> | the content to choose the locale from |

**Example**  
```js
getPreferredContentLocale(['de_DE', 'en_EN']) // => 'de_DE'
   getPreferredContentLocale({'de_DE': {1,'eins'}, 'en_EN': {1: 'one'}}) // => 'de_DE'
```
<a name="getUserContentLocale"></a>

## getUserContentLocale() ⇒ <code>Promise.&lt;any&gt;</code>
Get the current user's content locale, fallback to branch default locale

**Kind**: global function  

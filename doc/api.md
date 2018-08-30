## Members

<dl>
<dt><a href="#log">log</a></dt>
<dd><p>interface exports</p>
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
<dd><p>Get content languages configured in the app.</p>
</dd>
<dt><a href="#getBranchDefaultLanguage">getBranchDefaultLanguage()</a> ⇒ <code>Promise.&lt;any&gt;</code></dt>
<dd><p>Get content languages configured in the app.</p>
</dd>
<dt><a href="#getPreferredContentLocale">getPreferredContentLocale(content)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Gets the choosen language from a given content object</p>
</dd>
</dl>

<a name="log"></a>

## log
interface exports

**Kind**: global variable  
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
Get content languages configured in the app.

**Kind**: global function  
<a name="getBranchDefaultLanguage"></a>

## getBranchDefaultLanguage() ⇒ <code>Promise.&lt;any&gt;</code>
Get content languages configured in the app.

**Kind**: global function  
<a name="getPreferredContentLocale"></a>

## getPreferredContentLocale(content) ⇒ <code>Promise.&lt;string&gt;</code>
Gets the choosen language from a given content object

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>object</code> \| <code>array</code> | the content to choose the locale from |

**Example**  
```js
getPreferredContentLocale(['de_DE', 'en_EN']) // => 'de_DE'
   getPreferredContentLocale({'de_DE': {1,'eins'}, 'en_EN': {1: 'one'}}) // => 'de_DE'
```

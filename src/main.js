/**
 * interface exports
 */

let log = require('loglevel');
log.enableAll(); /* experimental */

import * as device from './lib/device';
import * as app from './lib/app';

/**
 * Check if device is able to perform a download.
 *
 * @return {Promise<boolean>}
 */
export async function deviceCanDownload() {
  return device.canDownload();
}

/**
 * Check if device is using ios.
 *
 * @return {Promise<boolean>}
 */
export async function isIosDevice() {
  return device.isIos();
}

/**
 * Check if device is using android.
 *
 * @return {Promise<boolean>}
 */
export async function isAndroidDevice() {
  return device.isAndroid();
}

/**
 * Get the version of the Staffbase App.
 *
 * @return {Promise<string>}
 */
export async function getAppVersion() {
  return app.getVersion();
}

/**
 * Check if app is native.
 *
 * @return {Promise<boolean>}
 */
export async function isNativeApp() {
  return app.isNative();
}

/**
 * Check if app is mobile.
 *
 * @return {Promise<boolean>}
 */
export async function isMobileApp() {
  return app.isMobile();
}

/**
 * Open a link through the app.
 *
 * Where Staffbase decides which browser (External/Internal)
 * should be used.
 *
 * @param {string} url the url to open in the browser
 *
 * @return {Promise<any>}
 */
export async function openLink() {
  return app.openLink();
}

/**
 * Open a link explicitly in the external browser.
 *
 * @param {string} url the url to open in the browser
 *
 * @return {Promise<any>}
 */
export async function openLinkExternal() {
  return app.openLinkExternal();
}

/**
 * Open a link explicitly in the internal browser.
 *
 * @param {string} url the url to open in the browser
 *
 * @return {Promise<any>}
 */
export async function openLinkInternal() {
  return app.openLinkInternal();
}

/**
 * Get content languages configured in the app.
 *
 * @return {Promise<any>}
 */
export async function getBranchLanguages() {
  return app.getBranchLanguages();
}

/**
 * Get content languages configured in the app.
 *
 * @return {Promise<any>}
 */
export async function getBranchDefaultLanguage() {
  return app.getBranchDefaultLanguage();
}

/**
 * Gets the choosen language from a given content object
 *
 * @example
 *    getPreferredContentLocale(['de_DE', 'en_EN']) // => 'de_DE'
 *    getPreferredContentLocale({'de_DE': {1,'eins'}, 'en_EN': {1: 'one'}}) // => 'de_DE'
 *
 * @param {object|array} content the content to choose the locale from
 *
 * @return {Promise<string>}
 */
export async function getPreferredContentLocale() {
  return app.getPreferredContentLocale();
}

/** @inheritdoc */
export { getLanguageInfos } from './lib/app'; /* experimental */
/** @inheritdoc */
export { openNativeFileDialog } from './lib/app'; /* experimental */

/**
 * Interface exports
 */

/**
 * @ignore
 */
import log from 'loglevel';
log.enableAll(); /* experimental */

import * as device from './lib/device';
import * as app from './lib/app';

/**
 * Check if device is able to perform a download.
 * @function
 * @return {Promise<boolean>}
 */
export const deviceCanDownload = async () => device.canDownload();

/**
 * Check if device is using ios.
 * @function
 * @return {Promise<boolean>}
 */
export const isIosDevice = async () => device.isIos();

/**
 * Check if device is using android.
 * @function
 * @return {Promise<boolean>}
 */
export const isAndroidDevice = async () => device.isAndroid();

/**
 * Get the version of the Staffbase App.
 * @function
 * @return {Promise<string>}
 */
export const getAppVersion = async () => app.getVersion();

/**
 * Check if app is native.
 * @function
 * @return {Promise<boolean>}
 */
export const isNativeApp = async () => app.isNative();

/**
 * Check if app is mobile.
 * @function
 * @return {Promise<boolean>}
 */
export const isMobileApp = async () => app.isMobile();

/**
 * Open a link through the app.
 *
 * Where Staffbase decides which browser (External/Internal)
 * should be used.
 *
 * @param {string} url the url to open in the browser
 * @function
 * @return {Promise<any>}
 */
export const openLink = async (url) => app.openLink(url);

/**
 * Open a link explicitly in the external browser.
 *
 * @param {string} url the url to open in the browser
 * @function
 * @return {Promise<any>}
 */
export const openLinkExternal = async (url) => app.openLinkExternal(url);

/**
 * Open a link explicitly in the internal browser.
 *
 * @param {string} url the url to open in the browser
 * @function
 * @return {Promise<any>}
 */
export const openLinkInternal = async (url) => app.openLinkInternal(url);

/**
 * Get all enabled content languages configured in the app.
 * @function
 * @return {Promise<any>}
 */
export const getBranchLanguages = async () => app.getBranchLanguages();

/**
 * Get the default content language configured in the app.
 * @function
 * @return {Promise<any>}
 */
export const getBranchDefaultLanguage = async () => app.getBranchDefaultLanguage();

/**
 * Get all content languages supported by the app.
 * @function
 * @return {Promise<any>}
 */
export const getContentLanguages = async () => app.getContentLanguages();

/**
 * Gets the chosen language from a given content object
 *
 * @example
 *    getPreferredContentLocale(['de_DE', 'en_EN']) // => 'de_DE'
 *    getPreferredContentLocale({'de_DE': {1,'eins'}, 'en_EN': {1: 'one'}}) // => 'de_DE'
 *
 * @param {object|array} content the content to choose the locale from
 * @function
 * @return {Promise<string>}
 */
export const getPreferredContentLocale = async (content) => app.getPreferredContentLocale(content);

/**
 * Get the current user's content language, fallback to branch default language
 * @function
 * @return {Promise<any>}
 */
export const getUserContentLanguage = async () => app.getUserContentLanguage();

/**
 * Open a share dialog on native devices
 *
 * @example
 *   openNativeShareDialog({
 *      image: "https://example.com/test.png",
 *      subject: "The string you would like to use as a subject for the share",
 *      text: "This text is shared",
 *      url: "https://example.com"
 *   })
 *
 * @param {object} content the content to share
 *
 * @return {Promise<string>}
 */
export const openNativeShareDialog = async (content) => app.openNativeShareDialog(content);

/** @inheritdoc */
export { openNativeFileDialog } from './lib/app'; /* experimental */

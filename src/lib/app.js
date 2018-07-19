import cmd from './connection/commands';
import sendMessage from './connection/connection';
let log = require('loglevel');

/**
 * Get the version of the Staffbase App
 *
 * @return {Promise<string>}
 */
export async function getVersion() {
  log.trace('app/getVersion');
  return sendMessage(cmd.version);
}

/**
 * Check if app is native
 *
 * @return {Promise<boolean>}
 */
export async function isNative() {
  log.trace('app/isNative');
  return sendMessage(cmd.native);
}

/**
 * Check if app is mobile
 *
 * @return {Promise<boolean>}
 */
export async function isMobile() {
  log.trace('app/isMobile');
  return sendMessage(cmd.mobile);
}

/**
 * Open a link through the app
 *
 * Where Staffbase decides which browser (External/Internal)
 * should be used.
 *
 * @param {string} url the url to open in the browser
 *
 * @return {Promise<any>}
 */
export async function openLink(url) {
  log.trace('app/openLink');
  return sendMessage(cmd.openLink, url);
}

/**
 * Open a link explicitly in the external browser
 *
 * @param {string} url the url to open in the browser
 *
 * @return {Promise<any>}
 */
export async function openLinkExternal(url) {
  log.trace('app/openLinkExternal');
  return sendMessage(cmd.openLink, url, { inAppBrowser: false });
}

/**
 * Open a link explicitly in the internal browser
 *
 * @param {string} url the url to open in the browser
 *
 * @return {Promise<any>}
 */
export async function openLinkInternal(url) {
  log.trace('app/openLinkInternal');
  return sendMessage(cmd.openLink, url, { inAppBrowser: true });
}

/**
 * Open a native file upload dialog on device which do not support it by default.
 *
 * Works only for android now
 *
 * @param {string} url the url to open in the browser
 *
 * @return {Promise<any>}
 */
export async function openNativeFileDialog() {
  log.trace('app/openNativeFileDialog');
  return sendMessage(cmd.nativeUpload);
}

/**
 * Get all language info from the app.
 *
 * Shoud get split up in the future and
 * removed from the public interface
 *
 * @return {Promise<any>}
 */
export async function getLanguageInfos() {
  log.trace('app/getLanguageInfos');
  return sendMessage(cmd.langInfos);
}

/**
 * Get content languages configured in the app.
 *
 * @return {Promise<any>}
 */
export async function getContentLanguages() {
  log.trace('app/getContentLanguages');
  return sendMessage(cmd.langInfos).then(res => res.contentLanguages);
}

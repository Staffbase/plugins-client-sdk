import cmd from './connection/commands';
import sendMessage from './connection/connection';

/**
 * Get the version of the Staffbase App
 *
 * @return {Promise<string>}
 */
export async function getVersion() {
  return sendMessage(cmd.version);
}

/**
 * Check if app is native
 *
 * @return {Promise<boolean>}
 */
export async function isNative() {
  return sendMessage(cmd.native);
}

/**
 * Check if app is mobile
 *
 * @return {Promise<boolean>}
 */
export async function isMobile() {
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
  return sendMessage(cmd.nativeUpload);
}

/**
 * Get content languages configured in the app.
 *
 * @return {Promise<any>}
 */
export async function getContentLanguages() {
  return sendMessage(cmd.langInfos).then(res => res.contentLanguages);
}

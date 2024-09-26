import cmd from './connection/commands';
import sendMessage from './connection/connection';
import log from 'loglevel';

/**
 * Get the version of the Staffbase App.
 *
 * @return {Promise<string>}
 */
export const getVersion = async () => {
  log.debug('app/getVersion');
  return sendMessage(cmd.version);
};

/**
 * Check if app is native.
 *
 * @return {Promise<boolean>}
 */
export const isNative = async () => {
  log.debug('app/isNative');
  return sendMessage(cmd.native);
};

/**
 * Check if app is mobile.
 *
 * @return {Promise<boolean>}
 */
export const isMobile = async () => {
  log.debug('app/isMobile');
  return sendMessage(cmd.mobile);
};

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
export const openLink = async (url) => {
  log.debug('app/openLink');
  return sendMessage(cmd.openLink, url);
};

/**
 * Open a link explicitly in the external browser.
 *
 * @param {string} url the url to open in the browser
 *
 * @return {Promise<any>}
 */
export const openLinkExternal = async (url) => {
  log.debug('app/openLinkExternal');
  return sendMessage(cmd.openLink, url, { inAppBrowser: false });
};

/**
 * Open a link explicitly in the internal browser.
 *
 * @param {string} url the url to open in the browser
 *
 * @return {Promise<any>}
 */
export const openLinkInternal = async (url) => {
  log.debug('app/openLinkInternal');
  return sendMessage(cmd.openLink, url, { inAppBrowser: true });
};

/**
 * Open a native file upload dialog on device which do not support it by default.
 *
 * Works only for android now
 *
 * @return {Promise<any>}
 */
export const openNativeFileDialog = async () => {
  log.debug('app/openNativeFileDialog');
  return sendMessage(cmd.nativeUpload);
};

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
export const openNativeShareDialog = async (content) => {
  log.debug('app/openNativeShareDialog');
  return sendMessage(cmd.nativeShare, content);
};

/**
 * Get the content languages configured for the branch.
 *
 * @return {Promise<Object>}
 */
export const getBranchLanguages = async () => {
  log.debug('app/getContentLanguages');
  return sendMessage(cmd.langInfos).then((res) => res.branchLanguages);
};

/**
 * Get the default content language configured for the branch.
 *
 * @return {Promise<Object>}
 */
export const getBranchDefaultLanguage = async () => {
  log.debug('app/getBranchDefaultLanguage');
  return sendMessage(cmd.langInfos).then((res) => res.branchDefaultLanguage);
};

/**
 * Get all content languages supported by the Staffbase app.
 *
 * @return {Promise<Object>}
 */
export const getContentLanguages = async () => {
  log.debug('app/getContentLanguages');
  return sendMessage(cmd.langInfos).then((res) => res.contentLanguages);
};

/**
 * Gets the chosen language from a given content object
 *
 * @example
 *    getPreferredContentLocale(['de_DE', 'en_EN']) // => 'de_DE'
 *    getPreferredContentLocale({'de_DE': {1,'eins'}, 'en_EN': {1: 'one'}}) // => 'de_DE'
 *
 * @param {object|array} content the content to choose the locale from
 *
 * @return {Promise<string>}
 */
export const getPreferredContentLocale = async (content) => {
  log.debug('app/getPreferredContentLocale');
  return sendMessage(cmd.prefContentLang, content);
};

/**
 * Get the default content language configured for the branch.
 *
 * @return {Promise<Object>}
 */
export const getUserContentLanguage = async () => {
  log.debug('app/getUserContentLanguage');
  return sendMessage(cmd.langInfos).then((res) => res.userContentLanguage);
};

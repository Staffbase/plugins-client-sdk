/**
 * Fallbacks for all sdk commands
 */
let log = require('loglevel');
let userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
/**
 * Get the current Staffbase app version
 *
 * @return {String} version
 */
export function getVersion() {
  log.trace('fallback/getVersion');
  return '3.4';
}

/**
 * Are we running in a native app
 *
 * works only for ios
 * @return {Boolean}
 */
export function isNative() {
  log.trace('fallback/isNative');
  let safari = /safari/i.test(userAgent);
  return !safari && isIos();
}

/**
 * Are we running on a mobile device
 *
 * @return {Boolean}
 */
export function isMobile() {
  log.trace('fallback/isMobile');
  return /Android|webOS|iPhone|iPad|BlackBerry|BB10|IEMobile|Opera Mini/i.test(userAgent);
}

/**
 * Are we running on a desktop device
 *
 * @return {Boolean}
 */
export function isDesktop() {
  log.trace('fallback/isDesktop');
  return /Win|Mac|Linux/i.test(userAgent);
}

/**
 * Are we running on android
 *
 * @return {Boolean}
 */
export function isAndroid() {
  log.trace('fallback/isAndroid');
  return /Android/i.test(userAgent);
}

/**
 * Are we running on ios
 *
 * @return {Boolean}
 */
export function isIos() {
  log.trace('fallback/isIos');
  return /iPhone|iPad|iPod/i.test(userAgent);
}

/**
 * Open an external link
 *
 * @param {String} url address
 */
export function openLink(url) {
  log.trace('fallback/openLink');
  window.open(url, '_blank');
}

/**
 * Open an external link
 *
 * @param {String} url address
 */
export function nativeUpload(url) {
  log.trace('fallback/nativeUpload');
  log.warn('Native upload is not possible in fallback mode.');
  // nothing we can do here
  return;
}

/**
 * Get extensive locale information.
 *
 * @return {Object} containing various language informations
 */
export function langInfos() {
  log.trace('fallback/langInfos');
  return {
    contentLanguages: ['en_EN', 'de_DE']
  };
}

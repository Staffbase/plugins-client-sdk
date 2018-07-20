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
  log.debug('fallback/getVersion');
  return '3.4';
}

/**
 * Are we running in a native app
 *
 * works only for ios
 * @return {Boolean}
 */
export function isNative() {
  log.debug('fallback/isNative');
  let safari = /safari/i.test(userAgent);
  return !safari && isIos();
}

/**
 * Are we running on a mobile device
 *
 * @return {Boolean}
 */
export function isMobile() {
  log.debug('fallback/isMobile');
  return /Android|webOS|iPhone|iPad|BlackBerry|BB10|IEMobile|Opera Mini/i.test(userAgent);
}

/**
 * Are we running on a desktop device
 *
 * @return {Boolean}
 */
export function isDesktop() {
  log.debug('fallback/isDesktop');
  return /Win|Mac|Linux/i.test(userAgent);
}

/**
 * Are we running on android
 *
 * @return {Boolean}
 */
export function isAndroid() {
  log.debug('fallback/isAndroid');
  return /Android/i.test(userAgent);
}

/**
 * Are we running on ios
 *
 * @return {Boolean}
 */
export function isIos() {
  log.debug('fallback/isIos');
  return /iPhone|iPad|iPod/i.test(userAgent);
}

/**
 * Open an external link
 *
 * @param {String} url address
 */
export function openLink(url) {
  log.debug('fallback/openLink');
  window.open(url, '_blank');
}

/**
 * Open an external link
 *
 * @param {String} url address
 */
export function nativeUpload(url) {
  log.debug('fallback/nativeUpload');
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
  log.debug('fallback/langInfos');
  return {
    contentLanguages: ['en_EN', 'de_DE']
  };
}

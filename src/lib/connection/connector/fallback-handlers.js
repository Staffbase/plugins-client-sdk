/**
 * Fallbacks for all sdk commands
 */

let userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
/**
 * Get the current Staffbase app version
 *
 * @return {String} version
 */
export function getVersion() {
  return '3.5';
}

/**
 * Are we running in a native app
 *
 * works only for ios
 * @return {Boolean}
 */
export function isNative() {
  let safari = /safari/i.test(userAgent);
  return !safari && isIos();
}

/**
 * Are we running on a mobile device
 *
 * @return {Boolean}
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|BlackBerry|BB10|IEMobile|Opera Mini/i.test(userAgent);
}

/**
 * Are we running on a desktop device
 *
 * @return {Boolean}
 */
export function isDesktop() {
  return /Win|Mac|Linux/i.test(userAgent);
}

/**
 * Are we running on android
 *
 * @return {Boolean}
 */
export function isAndroid() {
  return /Android/i.test(userAgent);
}

/**
 * Are we running on ios
 *
 * @return {Boolean}
 */
export function isIos() {
  return /iPhone|iPad|iPod/i.test(userAgent);
}

/**
 * Open an external link
 *
 * @param {String} url address
 */
export function openLink(url) {
    window.open(url, '_blank');
}

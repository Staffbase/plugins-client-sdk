/**
 * Fallbacks for all sdk commands
 */
import locales from './../../../model/locales';
import normalize from './../../utils/normalize';

let log = require('loglevel');
let userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
let currentLanguage = normalize(window && window.navigator.language);

// initialize Staffbase/platform namespace for ios frontend js code injection
// in case of executeJs of app version 3.5 this object gets overwritten
if (typeof window !== 'undefined') {
  window.Staffbase = window.Staffbase || {};
  window.Staffbase.platform = window.Staffbase.platform || {
    version: '3.4',
    mobile: /Android|webOS|iPhone|iPad|BlackBerry|BB10|IEMobile|Opera Mini/i.test(userAgent),
    native: false
  };
}

/**
 * Get the current Staffbase app version
 *
 * @return {String} version
 */
export function getVersion() {
  log.debug('fallback/getVersion');
  return window.Staffbase.platform.version;
}

/**
 * Are we running in a native app
 *
 * works only for ios or old initial native data
 * @return {Boolean}
 */
export function isNative() {
  log.debug('fallback/isNative');
  let safari = /safari/i.test(userAgent);
  return (
    window.Staffbase.platform.native === 'android' ||
    window.Staffbase.platform.native === 'ios' ||
    (!safari && isIos())
  );
}

/**
 * Are we running on a mobile device
 *
 * @return {Boolean}
 */
export function isMobile() {
  log.debug('fallback/isMobile');
  return window.Staffbase.platform.mobile;
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
  return window.Staffbase.platform.native === 'android' || /Android/i.test(userAgent);
}

/**
 * Are we running on ios
 *
 * @return {Boolean}
 */
export function isIos() {
  log.debug('fallback/isIos');
  return window.Staffbase.platform.native === 'ios' || /iPhone|iPad|iPod/i.test(userAgent);
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
    contentLanguage: getBranchDefaultLanguage(),
    branchLanguages: locales,
    deviceLanguage: getBranchDefaultLanguage(),
    contentLanguages: locales
  };
}

/**
 * Get the default language object
 *
 * @return {Object} the language object
 */
export function getBranchDefaultLanguage() {
  log.debug('fallback/getBranchDefaultLanguage');

  return locales[currentLanguage] || locales.en || locales[Object.keys(locales)[0]];
}

/**
 * Gets the choosen language from a given content object
 *
 * @param {object|array} content
 *
 * @return {string}
 */
export function getPreferredContentLocale(content) {
  log.debug('fallback/getPreferredContentLocale');
  const locale = getBranchDefaultLanguage().locale;

  if (Array.isArray(content)) {
    const index = content.indexOf(locale);

    return content[index] || content[0];
  } else {
    const keys = Object.keys(content);
    const index = keys.indexOf(locale);

    return keys[index] || keys[0];
  }
}

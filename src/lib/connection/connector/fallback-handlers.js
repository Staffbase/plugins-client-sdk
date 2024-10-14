/**
 * Fallbacks for all sdk commands
 */
import locales from './../../../model/locales';
import normalize from './../../utils/normalize';

import log from 'loglevel';

const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
const currentLanguage = normalize(window && window.navigator.language);

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
export const getVersion = () => {
  log.debug('fallback/getVersion');
  return window.Staffbase.platform.version;
};

/**
 * Are we running in a native app
 *
 * works only for ios or old initial native data
 * @return {Boolean}
 */
export const isNative = () => {
  log.debug('fallback/isNative');
  const safari = /safari/i.test(userAgent);
  return (
    window.Staffbase.platform.native === 'android' ||
    window.Staffbase.platform.native === 'ios' ||
    (!safari && isIos())
  );
};

/**
 * Are we running on a mobile device
 *
 * @return {Boolean}
 */
export const isMobile = () => {
  log.debug('fallback/isMobile');
  return window.Staffbase.platform.mobile;
};

/**
 * Are we running on a desktop device
 *
 * @return {Boolean}
 */
export const isDesktop = () => {
  log.debug('fallback/isDesktop');
  return /Win|Mac|Linux/i.test(userAgent);
};

/**
 * Are we running on android
 *
 * @return {Boolean}
 */
export const isAndroid = () => {
  log.debug('fallback/isAndroid');
  return window.Staffbase.platform.native === 'android' || /Android/i.test(userAgent);
};

/**
 * Are we running on ios
 *
 * @return {Boolean}
 */
export const isIos = () => {
  log.debug('fallback/isIos');
  return window.Staffbase.platform.native === 'ios' || /iPhone|iPad|iPod/i.test(userAgent);
};

/**
 * Open an external link
 *
 * @param {String} url address
 */
export const openLink = (url) => {
  log.debug('fallback/openLink');
  window.open(url, '_blank');
};

/**
 * Handler for unpossible functions
 *
 * @param {String} cmd command name
 */
export const unSupported = (cmd) => {
  log.debug('fallback/' + cmd);
  log.warn('Command is not possible in fallback mode.');
  // nothing we can do here
  return;
};

/**
 * Get extensive locale information.
 *
 * @return {Object} containing various language informations
 */
export const langInfos = () => {
  log.debug('fallback/langInfos');
  const branchDefaultLanguage = getBranchDefaultLanguage();

  return {
    contentLanguage: branchDefaultLanguage,
    branchLanguages: locales,
    branchDefaultLanguage: branchDefaultLanguage,
    deviceLanguage: branchDefaultLanguage,
    contentLanguages: locales
  };
};

/**
 * Get the default language object
 *
 * @return {Object} the language object
 */
export const getBranchDefaultLanguage = () => {
  log.debug('fallback/getBranchDefaultLanguage');

  return locales[currentLanguage] || locales.en;
};

/**
 * Gets the chosen language from a given content object
 *
 * @param {?object|array} content
 *
 * @return {string}
 */
export const getPreferredContentLocale = (content) => {
  log.debug('fallback/getPreferredContentLocale');
  const locale = getBranchDefaultLanguage().locale;

  if (!content) {
    return locale;
  }

  if (Array.isArray(content)) {
    const index = content.indexOf(locale);

    return content[index] || content[0];
  } else {
    const keys = Object.keys(content);
    const index = keys.indexOf(locale);

    return keys[index] || keys[0];
  }
};

/**
 * Get the current user's content locale, fallback to branch default locale
 *
 * @return {String} the user's content locale
 */
export const getUserContentLocale = () => {
  log.debug('fallback/getUserContentLocale');
  const locale = getBranchDefaultLanguage().locale;

  return locale;
};

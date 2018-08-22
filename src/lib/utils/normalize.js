/**
 * Handles the locale codes as the frontend
 *
 * @param {string} locale the locale code
 *
 * @return {string} the first part of the locale
 */
export default locale => {
  locale = (locale && locale.split(/-|_/)[0]) || locale; // use only first part

  if (['nb', 'nn'].indexOf(locale) !== -1) {
    // fix Norwegian language code to conform with our non-standard stuff
    locale = 'no';
  }

  if (locale === 'iw') {
    // fix legacy Hebrew language code from our backend to conform with our frontend
    locale = 'he';
  }

  return locale;
};

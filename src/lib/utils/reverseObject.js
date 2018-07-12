import '../polyfills/objectEntries';

/**
 * Reverses the keys and properties of the given object
 *
 * @param {object} obj the object to reverse
 * @return {object}
 */
const reverse = obj =>
  Object.entries(obj).reduce((acc, [k, p]) => {
    acc[p] = k;
    return acc;
  }, {});

export default reverse;

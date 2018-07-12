/**
 * Get objects own key value pairs
 *
 * The Object.entries() method returns an array of a given object's
 * own enumerable property [key, value] pairs, in the same order as
 * that provided by a for...in loop
 *
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
 *
 * @param {Object} obj from which to extract the entries
 * @return {Array}
 */
if (!Object.entries)
  Object.entries = function(obj) {
    let ownProps = Object.keys(obj);
    let i = ownProps.length;
    let resArray = new Array(i); // preallocate the Array
    while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
  };

/**
 * Generates an unique id of 4 alpha numerical chars
 *
 * @return {string} unique id
 */
const genID = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

export default genID;

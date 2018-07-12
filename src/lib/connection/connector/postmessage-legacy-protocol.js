/**
 * Postmessage legacy protocol (3.5)
 */

export default {
  init: 'pluginLoaded', // send this if ready to communicate
  platformInfo: 'platformInfo' // receive this after pluginLoaded was sent
};

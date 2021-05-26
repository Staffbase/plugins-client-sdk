import { commands as action } from '../commands';
import * as fallbacks from './fallback-handlers';
import log from 'loglevel';

let connection = null;
const fallbackKickIn = 500;

/**
 * Fake connection to the Staffbase App after a period of time.
 *
 * The fallback message handler will signal an established connection
 * after the time specified in fallbackKickIn runs out.
 * @return {Promise<function>} An appropriate send function
 */
export default () => {
  if (connection) {
    return connection;
  }

  connection = new Promise((resolve, reject) => {
    setTimeout(function () {
      log.info('fallback/connect succeeded');
      resolve(sendMessage);
    }, fallbackKickIn);
  });

  return connection;
};

/**
 * Disconnect from the Staffbase App
 *
 * Only useful for tests.
 */
export const disconnect = () => {
  connection = null;
};

/**
 * Send a SDK command to the Staffbase App.
 *
 * Maps SDK commands to fallback handlers.
 * @param {String} cmd an SDK command
 * @param {any} payload for the command
 * @return {Promise<any>} which awaits the response of the Staffbase App
 * @throws {Error} on commands not supported by protocol
 */
export const sendMessage = async (cmd, ...payload) => {
  log.info('fallback/sendMessage ' + cmd);
  log.debug('fallback/sendMessage/payload ' + JSON.stringify(payload));

  switch (cmd) {
    case action.version:
      return fallbacks.getVersion();
    case action.native:
      return fallbacks.isNative();
    case action.mobile:
      return fallbacks.isMobile();
    case action.ios:
      return fallbacks.isIos();
    case action.android:
      return fallbacks.isAndroid();
    case action.openLink:
      return fallbacks.openLink.apply(null, payload);
    case action.langInfos:
      return fallbacks.langInfos();
    case action.branchDefaultLang:
      return fallbacks.getBranchDefaultLanguage();
    case action.prefContentLang:
      return fallbacks.getPreferredContentLocale.apply(null, payload);
    case action.nativeUpload:
    case action.nativeShare:
      return fallbacks.unSupported(cmd);
    default:
      // should actually never ever happen
      throw new Error('Command ' + cmd + ' not supported by driver');
  }
};

import { commands as actions, reversedCommands as reversedActions } from '../commands.js';
import protocol, { invocationMapping } from './postmessage-protocol.js';
import {
  create as createPromise,
  resolve as resolvePromise,
  reject as rejectPromise,
  get as getPromise
} from '../manager.js';

import log from 'loglevel';

/**
 * @typedef {{ mobile: boolean, version: string|number, native: string }} PlatformInfos
 * @typedef {{ key: string, locale: string, name: string, localizedName: string }} BranchDefaultLanguage
 * @typedef { Object.<string, BranchDefaultLanguage> } BranchLanguage
 * @typedef {{ branchDefaultLanguage: BranchDefaultLanguage, branchLanguage: BranchLanguage, contentLanguage: BranchDefaultLanguage, contentLanguages: BranchLanguage, deviceLanguage: BranchDefaultLanguage }} LanguageInfos
 * @typedef {{ platform: PlatformInfos, language: LanguageInfos }} InitialValues
 *
 * @typedef {{ mobile: boolean, version: string|number, native: string, ios: boolean, android: boolean, langInfos: LanguageInfos, branchDefaultLanguage: BranchDefaultLanguage }} StaticValueStore
 */

/**
 * Simple store solution to make the initial data available
 * as static values
 *
 * @param {InitialValues} initial the initial data from the frontend
 * @static
 * @return {StaticValueStore}
 */
const dataStore = ({ platform, language }) => ({
  mobile: platform.mobile,
  version: platform.version,
  native: !!platform.native,
  ios: platform.native === 'ios',
  android: platform.native === 'android',
  langInfos: language,
  branchDefaultLanguage: language.branchDefaultLanguage
});

let connection = null;
const targetOrigin = '*';

/**
 * Connect to the Staffbase App.
 *
 * Create a connection to a Staffbase app
 * Tries to reconnect until an answer is received
 *
 * @return {Promise<Function>} An appropriate send function
 */
const connect = () => {
  if (connection) {
    return connection;
  }

  const connectId = createPromise();
  let timeout;
  const delayFactor = 1.2;

  connection = getPromise(connectId).then((payload) => {
    log.info('postMessage/connect succeeded');
    window.clearTimeout(timeout);
    return sendMessage(dataStore(payload));
  });

  window.addEventListener('message', receiveMessage);

  const recurringConnect = (delay = 500) => {
    log.info('postMessage/connect retry');
    timeout = window.setTimeout(() => {
      if (delay < 1200) {
        log.info('postMessage/connect abort');
        recurringConnect(delay * delayFactor);
      } else {
        rejectPromise(connectId, 'No answer from Staffbase App');
        disconnect();
      }
    }, delay);

    window.parent.postMessage([protocol.HELLO, connectId, []], targetOrigin);
  };

  recurringConnect();

  return connection;
};

export default connect;

/**
 * Disconnect from the Staffbase App
 *
 * Only useful for tests.
 */
export const disconnect = () => {
  window.removeEventListener('message', receiveMessage);
  connection = null;
};

/**
 * Handler that receives a message from the Staffbase app
 *
 * Can be attached to window.onPostMessage
 * @param {MessageEvent} evt onPostMessage event result
 */
const receiveMessage = async (evt) => {
  log.info('postMessage/receiveMessage');

  let type;
  let id;
  let payload;

  // safe destructure
  try {
    ({
      data: [type, id, payload]
    } = evt);
  } catch (e) {
    // even thought catch-ignore is a bad style
    // there may be other participants listening
    // to messages in a different format so we
    // silently ignore here
    return;
  }

  log.debug('postMessage/receiveMessage/payload ' + JSON.stringify([type, id, payload]));

  switch (type) {
    case protocol.SUCCESS:
      log.debug('postMessage/receiveMessage/success ' + JSON.stringify(id));
      resolvePromise(id, payload);
      break;
    case protocol.ERROR:
      log.debug('postMessage/receiveMessage/error ' + JSON.stringify(id));
      rejectPromise(id, payload);
      break;
    default:
      // even thought catch-ignore is a bad style
      // there may be other participants listening
      // to messages in a different format so we
      // silently ignore here
      return;
  }
};

/**
 * Send a SDK command to the Staffbase App.
 *
 * Translates SDK commands into protocol native commands.
 * @param {StaticValueStore} store the store object
 * @param {String} cmd an SDK command
 * @param {array} payload for the command
 * @return {Promise<any>} which awaits the response of the Staffbase App
 * @throws {Error} on commands not supported by protocol
 */
const sendMessage =
  (store) =>
  async (cmd, ...payload) => {
    log.info('postMessage/sendMessage ' + cmd);
    log.debug('postMessage/sendMessage/payload ' + JSON.stringify(payload));

    switch (cmd) {
      case actions.version:
      case actions.native:
      case actions.mobile:
      case actions.ios:
      case actions.android:
      case actions.branchDefaultLang:
        return store[reversedActions[cmd]];
      case actions.langInfos:
      case actions.openLink:
      case actions.nativeUpload:
      case actions.nativeShare:
      case actions.prefContentLang:
        return sendInvocationCall(createPromise())(invocationMapping[cmd], payload);
      default:
        throw new Error('Command ' + cmd + ' not supported by driver');
    }
  };

/**
 * Create a promise and send an invocation call to the frontend
 *
 * @param {number} promiseID the id of the connection promise
 * @param {string} process the name of the process to call
 * @param {array} args an array of arguments
 *
 * @return {Promise}
 */
const sendInvocationCall = (promiseID) => (process, args) => {
  log.info('postMessage/sendInvocationCall ' + process);
  log.debug('postMessage/sendInvocationCall/payload ' + JSON.stringify(args));

  window.parent.postMessage([protocol.INVOCATION, promiseID, process, args], targetOrigin);

  return getPromise(promiseID);
};

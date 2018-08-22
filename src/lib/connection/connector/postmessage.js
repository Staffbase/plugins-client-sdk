import { commands as actions, reversedCommands as reversedActions } from '../commands.js';
import protocol, { invocationMapping } from './postmessage-protocol.js';
import {
  create as createPromise,
  resolve as resolvePromise,
  reject as rejectPromise,
  get as getPromise,
  unload as unloadManager
} from '../manager.js';
let log = require('loglevel');

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
  native: platform.native,
  ios: platform.native === 'ios',
  android: platform.native === 'android',
  langInfos: language,
  branchDefaultLanguage: language.branchDefaultLanguage
});

let connection = null;
let targetOrigin = '*';

/**
 * Connect to the Staffbase App.
 *
 * Create a connection to a Staffbase app 3.6
 * @return {Promise<function>} An appropriate send function
 */
export default function connect() {
  if (connection) {
    throw new Error('Connect called twice.');
  }

  const connectId = createPromise();
  connection = getPromise(connectId).then(function(payload) {
    log.info('postMessage/connect succeeded');
    return sendMessage(dataStore(payload));
  });

  window.addEventListener('message', receiveMessage);
  window.parent.postMessage([protocol.HELLO, connectId, []], targetOrigin);

  return connection;
}

/**
 * Disconnect from the Staffbase App
 *
 * Only useful for tests.
 */
export function disconnect() {
  unloadManager();
  connection = null;
}

/**
 * Handler that receives a message from the Staffbase app
 *
 * Can be attached to window.onPostMessage
 * @param {MessageEvent} evt onPostMessage event result
 */
async function receiveMessage(evt) {
  log.info('postMessage/receiveMessage ' + evt);

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
}

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
const sendMessage = store => async (cmd, ...payload) => {
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
const sendInvocationCall = promiseID => (process, args) => {
  log.info('postMessage/sendInvocationCall ' + process);
  log.debug('postMessage/sendInvocationCall/payload ' + JSON.stringify(args));

  window.parent.postMessage([protocol.INVOCATION, promiseID, process, args], targetOrigin);

  return getPromise(promiseID);
};

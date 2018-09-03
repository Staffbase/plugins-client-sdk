import { commands as actions, reversedCommands as reversedActions } from '../commands.js';
import protocol, { invocationMapping } from './postmessage-legacy-protocol.js';
import {
  create as createPromise,
  resolve as resolvePromise,
  get as getPromise
} from '../manager.js';

import { sendMessage as fallBackSendMessage } from './fallback.js';

let log = require('loglevel');

let connection = null;
let connectId = null;
let targetOrigin = '*';

/**
 * @typedef {{ mobile: boolean, version: string|number, native: string }} PlatformInfos
 * @typedef {{ mobile: boolean, version: string|number, native: string, ios: boolean, android: boolean }} StaticValueStore
 */

/**
 * Simple store solution to make the initial data available
 * as static values
 *
 * @param {PlatformInfos} initial the initial data from the frontend
 * @static
 * @return {StaticValueStore}
 */
const dataStore = initial => ({
  mobile: initial.mobile,
  version: initial.version,
  native: !!initial.native,
  ios: initial.native === 'ios',
  android: initial.native === 'android'
});

/**
 * Connect to the Staffbase App.
 *
 * Create a connection to a Staffbase app 3.5
 * @return {Promise<function>} An appropriate send function
 */
const connect = () => {
  if (connection) {
    return connection;
  }

  connectId = createPromise();
  connection = getPromise(connectId).then(function(payload) {
    log.info('pm-legacy/connect succeeded');
    return sendMessage(dataStore(payload));
  });

  window.addEventListener('message', receiveMessage);
  window.parent.postMessage(protocol.init, targetOrigin);
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
  connectId = null;
};

/**
 * Handler that receives a message from the Staffbase app
 *
 * Can be attached to window.onPostMessage
 * @param {Object} an onPostMessage event result
 */
const receiveMessage = async ({ data = {} }) => {
  log.info('pm-legacy/receiveMessage ' + data);
  log.debug('pm-legacy/receiveMessage/payload ' + JSON.stringify(data));

  switch (data.state) {
    case protocol.platformInfo:
      log.info('pm-legacy/connect succeeded');
      resolvePromise(connectId, data.info);
      break;
    case protocol.finishUpload:
      log.info('pm-legacy/nativeUpload succeeded');
      resolvePromise(connectId, data.file);
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
const sendMessage = store => async (cmd, ...payload) => {
  log.info('pm-legacy/sendMessage ' + cmd);
  log.debug('pm-legacy/sendMessage/payload ' + JSON.stringify(payload));

  switch (cmd) {
    case actions.version:
    case actions.native:
    case actions.mobile:
    case actions.ios:
    case actions.android:
      return store[reversedActions[cmd]];
    case actions.nativeUpload:
      return sendInvocationCall(invocationMapping[cmd], payload);
    default:
      return fallBackSendMessage.apply(null, [cmd, ...payload]);
  }
};

/**
 * Create a promise and send an invocation call to the frontend
 *
 * @param {string} process the name of the process to call
 * @param {array} args an array of arguments
 *
 * @return {Promise}
 */
const sendInvocationCall = (process, args) => {
  log.info('pm-legacy/sendInvocationCall ' + process);
  log.debug('pm-legacy/sendInvocationCall/payload ' + JSON.stringify(args));

  connectId = createPromise();
  window.parent.postMessage(protocol.startUpload, targetOrigin);

  return getPromise(connectId);
};

import { commands as actions, reversedCommands as reversedActions } from '../commands.js';
import protocol, { invocationMapping } from './postmessage-protocol.js';
import {
  create as createPromise,
  resolve as resolvePromise,
  reject as rejectPromise,
  get as getPromise,
  unload as unloadManager
} from '../manager.js';

/**
 * @typedef {{mobile: boolean, version: string|number, native: string}} InitialValues
 * @typedef {{mobile: boolean, version: string|number, native: string, ios: boolean, android: boolean}} StaticValueStore
 */

/**
 * Simple store solution to make the initial data available
 * as static values
 *
 * @param {InitialValues} initial the initial data from the frontend
 * @static
 * @return {StaticValueStore}
 */
const dataStore = initial => ({
  mobile: initial.mobile,
  version: initial.version,
  native: initial.native,
  ios: initial.native === 'ios',
  android: initial.native === 'android'
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
  connection = getPromise(connectId).then(payload => sendMessage(dataStore(payload)));

  window.addEventListener('message', receiveMessage);
  window.parent.postMessage([protocol.HELLO, connectId, []], targetOrigin);

  return connection;
}

/**
 * Disconnect from the Staffbase App
 *
 * Only usefull for tests.
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
async function receiveMessage({ data: [type, id, payload] }) {
  switch (type) {
    case protocol.SUCCESS:
      resolvePromise(id, payload);
      break;
    case protocol.ERROR:
      rejectPromise(id, payload);
      break;
    default:
      // even thougth catch-ignore is a bad style
      // there may be other participants listening
      // to messages in a diffrent format so we
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
  switch (cmd) {
    case actions.version:
    case actions.native:
    case actions.mobile:
    case actions.ios:
    case actions.android:
      return sendValue(store[reversedActions[cmd]]);
    case actions.openLink:
      return sendInvocationCall(invocationMapping[cmd], payload);
    default:
      throw new Error('Command ' + cmd + ' not supported by driver');
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
  const promiseID = createPromise();
  window.parent.postMessage([protocol.INVOCATION, promiseID, process, args], targetOrigin);

  return getPromise(promiseID);
};

/**
 * Fake initial values as real calls
 *
 * Binds all values to the connect promise
 * @param {any} val that will be sent when it's ready
 * @return {Promise<any>} the promissified val
 */
async function sendValue(val) {
  return connection.then(() => val);
}

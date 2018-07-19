import { commands as action } from '../commands.js';
import protocol from './postmessage-legacy-protocol.js';
import {
  create as createPromise,
  resolve as resolvePromise,
  get as getPromise
} from '../manager.js';
let log = require('loglevel');

// initial data
let mobile = false;
let native = false;
let version = 0.0;
let ios = false;
let android = false;

let connection = null;
let connectId = null;

/**
 * Connect to the Staffbase App.
 *
 * Create a connection to a Staffbase app 3.5
 * @return {Promise<function>} An appropriate send function
 */
export default function connect() {
  if (connection) {
    throw new Error('Connect called twice.');
  }

  let origin = '*';

  connectId = createPromise();
  connection = getPromise(connectId);

  window.addEventListener('message', receiveMessage);
  window.parent.postMessage(protocol.init, origin);
  return connection;
}

/**
 * Disconnect from the Staffbase App
 *
 * Only usefull for tests.
 */
export function disconnect() {
  connection = null;
  connectId = null;
}

/**
 * Handler that receives a message from the Staffbase app
 *
 * Can be attached to window.onPostMessage
 * @param {Object} an onPostMessage event result
 */
async function receiveMessage({ data = {} }) {
  log.debug('pm-legacy/receiveMessage ' + data.state);
  log.trace('pm-legacy/receiveMessage/payload ' + JSON.stringify(data));

  switch (data.state) {
    case protocol.platformInfo:
      mobile = data.info.mobile;
      version = data.info.version;
      native = !!data.info.native;
      ios = data.info.native === 'ios';
      android = data.info.native === 'android';
      log.debug('pm-legacy/connect succeeded');
      resolvePromise(connectId, sendMessage);
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
 * @param {String} cmd an SDK command
 * @param {any} payload for the command
 * @return {Promise<any>} which awaits the response of the Staffbase App
 * @throws {Error} on commands not supported by protocol
 */
async function sendMessage(cmd, payload) {
  log.debug('pm-legacy/sendMessage ' + cmd);
  log.trace('pm-legacy/sendMessage/payload ' + JSON.stringify(payload));

  switch (cmd) {
    case action.version:
      return sendValue(version);
    case action.native:
      return sendValue(native);
    case action.mobile:
      return sendValue(mobile);
    case action.ios:
      return sendValue(ios);
    case action.android:
      return sendValue(android);
    default:
      throw new Error('Command ' + cmd + ' not supported by driver');
  }
}

/**
 * Fake initial values as real calls
 *
 * Binds all values to the connect promise
 * @param {any} val that will be sent when it's ready
 * @return {Promise<any>} the promissified val
 */
async function sendValue(val) {
  log.debug('pm-legacy/sendValue ' + JSON.stringify(val));
  return connection.then(() => val);
}

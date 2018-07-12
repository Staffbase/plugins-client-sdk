import { commands as action } from '../commands';
import * as fallbacks from './fallback-handlers';

let connection = null;
const fallbackKickIn = 500;

/**
 * Fake connection to the Staffbase App after a period of time.
 *
 * The fallback message handler will signal an established connection
 * after the time specified in fallbackKickIn runs out.
 * @return {Promise<function>} An appropriate send function
 */
export default function connect() {
  if (connection) {
    throw new Error('Connect called twice.');
  }

  connection = new Promise((resolve, reject) => {
    setTimeout(() => resolve(sendMessage), fallbackKickIn);
  });

  return connection;
}

/**
 * Disconnect from the Staffbase App
 *
 * Only usefull for tests.
 */
export function disconnect() {
  connection = null;
}

/**
 * Send a SDK command to the Staffbase App.
 *
 * Maps SDK commands to fallback handlers.
 * @param {String} cmd an SDK command
 * @param {any} payload for the command
 * @return {Promise<any>} which awaits the response of the Staffbase App
 * @throws {Error} on commands not supported by protocol
 */
async function sendMessage(cmd, payload) {
  switch (cmd) {
    case action.version:
      return sendValue(fallbacks.getVersion());
    case action.native:
      return sendValue(fallbacks.isNative());
    case action.mobile:
      return sendValue(fallbacks.isMobile());
    case action.ios:
      return sendValue(fallbacks.isIos());
    case action.android:
      return sendValue(fallbacks.isAndroid());
    case action.openLink:
      return sendValue(fallbacks.openLink.apply(payload));
    default:
      // should actualy never ever happen
      throw new Error('Command ' + cmd + ' not supported by driver');
  }
}

/**
 * Fake values as real calls
 *
 * Binds all values to the connect promise
 * @param {any} val that will be sent when it's ready
 * @return {Promise<any>} the promissified val
 */
async function sendValue(val) {
  return connection.then(() => val);
}
import { commands as actions, reversedCommands as reversedActions } from '../commands.js';
import protocol, { invocationMapping } from './postmessage-protocol.js';
import {
  create as createPromise,
  resolve as resolvePromise,
  reject as rejectPromise,
  get as getPromise
} from '../manager.js';

const log = require('loglevel');

let connection = null;
let outMsgQueue = [];

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
  branchDefaultLang: language.branchDefaultLanguage
});

window.Staffbase = window.Staffbase || {};
window.Staffbase.plugins = {
  getMessages: multiMessageProvider,
  putMessage: singleMessageReceiver
};

/**
 * Connect to the Staffbase App.
 *
 * Create a connection to a Staffbase app 3.6 from a native tab
 * @return {Promise<function>} An appropriate send function
 */
const connect = () => {
  if (connection) {
    return connection;
  }

  log.info('putMessage/connect start');
  const connectId = createPromise();
  connection = getPromise(connectId).then(function (payload) {
    log.info('putMessage/connect succeeded');
    return sendMessage(dataStore(payload));
  });

  outMsgQueue.push([protocol.HELLO, connectId, []]);

  return connection;
};

export default connect;

/**
 * A function which returns an array of messages
 *
 * The return value holds all messages in the order the were
 * received over time by sendMessage
 *
 * @return {Array} ordered list of messages
 */
function multiMessageProvider() {
  const queueRef = outMsgQueue;
  if (queueRef.length) {
    log.debug('putMessage/multiMessageProvider/queue', queueRef);
  }
  outMsgQueue = [];
  return queueRef;
}

/**
 * A function which can receive a single message.
 *
 * Can be attached to window.onPostMessage
 * @param {Array} msg Staffbase 3.6 message
 */
function singleMessageReceiver(msg) {
  log.info('putMessage/singleMessageReceiver ' + JSON.stringify(msg));

  let type;
  let id;
  let payload;

  // safe destructure
  try {
    [type, id, payload] = msg;

    switch (type) {
      case protocol.SUCCESS:
        log.debug('putMessage/singleMessageReceiver/success ' + id);
        resolvePromise(id, payload);
        break;
      case protocol.ERROR:
        log.debug('putMessage/singleMessageReceiver/error ' + id);
        rejectPromise(id, payload);
        break;
      default:
        // even thought catch-ignore is a bad style
        // there may be other participants listening
        // to messages in a different format so we
        // silently ignore here
        return;
    }
  } catch (e) {
    // even thought catch-ignore is a bad style
    // there may be other participants listening
    // to messages in a different format so we
    // silently ignore here
    return;
  }
}

/**
 * Disconnect from the Staffbase App
 *
 * Only useful for tests.
 */
export const disconnect = () => {
  connection = null;
  outMsgQueue = [];
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
    log.info('putMessage/sendMessage ' + cmd);
    log.debug('putMessage/sendMessage/payload ' + JSON.stringify(payload));
    switch (cmd) {
      case actions.version:
      case actions.native:
      case actions.mobile:
      case actions.ios:
      case actions.android:
      case actions.langInfos:
      case actions.branchDefaultLang:
        return store[reversedActions[cmd]];
      case actions.openLink:
      case actions.prefContentLang:
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
  log.info('putMessage/sendInvocationCall ' + process);
  log.debug('putMessage/sendInvocationCall/payload: ' + JSON.stringify(args));

  const promiseID = createPromise();

  log.debug('putMessage/sendInvocationCall/queue/before ' + JSON.stringify(outMsgQueue));
  outMsgQueue.push([protocol.INVOCATION, promiseID, process, args]);
  log.debug('putMessage/sendInvocationCall/queue/after ' + JSON.stringify(outMsgQueue));

  return getPromise(promiseID);
};

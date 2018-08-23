/* eslint-env jest, es6 */

/**
 * Stub the post message interface
 *
 * postMessage will triger the registered message handler directly
 * either with default event mock or the provided msg
 *
 * @param {any} msg to send to the eventListener
 * @return {function}
 */
const stubPostMessage = (msg = '') => {
  let callback = null;
  let fakeEvent = msg;

  let addEventListener = (m, cb) => {
    callback = cb;
  };

  let postMessage = (m, o) => {
    // forwards correct message id
    if (Array.isArray(fakeEvent)) {
      fakeEvent[1] = m[1];
    }

    window.setTimeout(() => {
      callback({ data: fakeEvent });
    }, 10);
  };

  mockPostMessage(addEventListener, postMessage);

  return { changeMsg: msg => (fakeEvent = msg) };
};

/**
 * Mock the post message interface
 *
 * so acting on post message will yield no results by default
 * or provide custom implementations
 *
 * @param {function} cbAEL window.addEventListener implementation
 * @param {function} cbPM window.postMessage implementation
 */
export const mockPostMessage = (cbAEL, cbPM) => {
  jest
    .spyOn(window, 'addEventListener')
    .mockImplementation(cbAEL || function(message, receiveMessage) {});
  jest.spyOn(window.parent, 'postMessage').mockImplementation(cbPM || function(message, origin) {});
};

export default stubPostMessage;

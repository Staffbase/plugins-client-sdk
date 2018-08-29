/* eslint-env jest, es6 */

/**
 * Stub the post message interface
 *
 * postMessage will triger the registered message handler directly
 * either with default event mock or the provided msg
 *
 * @param {any} msg to send to the eventListener
 * @param {number} timeout the timeout, the postmessage takes to answer
 * @return {function}
 */
const stubPostMessage = (msg = '', timeout = 10) => {
  let callbacks = [];
  let fakeEvent = msg;
  let timeouts = [];

  const addEventListener = (m, cb) => {
    // console.log('add eventlistener', m, cb.toString().match(/log\.info\((.*)\);/)[1]);
    callbacks.push(cb);
  };

  const answerMessage = receiver => {
    // console.log(
    //   'send message ',
    //   fakeEvent,
    //   'to ',
    //   receiver.toString().match(/log\.info\((.*)\);/)[1]
    // );
    receiver({ data: fakeEvent });
  };

  const postMessage = (m, o) => {
    // console.log('postmessage received ', m, o);
    // forwards correct message id
    if (Array.isArray(fakeEvent) && Array.isArray(m)) {
      fakeEvent[1] = m[1];
      // console.log(fakeEvent);
    }

    stopMessaging();

    timeouts = timeouts.concat(
      callbacks.map(cb => {
        return window.setTimeout(answerMessage, timeout, cb);
      })
    );
  };

  const stopMessaging = () => {
    timeouts.forEach(timeout => window.clearTimeout(timeout));
  };

  mockPostMessage(addEventListener, postMessage);

  return {
    changeMsg: msg => (fakeEvent = msg),
    stopMessaging: stopMessaging
  };
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
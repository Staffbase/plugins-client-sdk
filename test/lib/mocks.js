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
  const callbacks = [];
  const fakeEvent = [msg];
  let timeouts = [];

  const addEventListener = (m, cb) => {
    console.log('add eventlistener', m, cb.name);
    callbacks.push(cb);
  };

  const answerMessage = (message) => (receiver) => {
    console.log('send message ', fakeEvent, 'to ', receiver.name);
    receiver({ data: message });
  };

  const postMessage = (m, o) => {
    console.log('postmessage received ', m, o);
    let message;

    if (m === 'pluginLoaded' || m[0] === 'HELLO') {
      message = fakeEvent[0];
    } else {
      message = fakeEvent[1] || fakeEvent[0];
    }
    // forwards correct message id
    if (Array.isArray(message) && Array.isArray(m)) {
      message[1] = m[1];
    }

    // stopMessaging();

    timeouts = timeouts.concat(
      callbacks.map((cb) => {
        return window.setTimeout(answerMessage(message), timeout, cb);
      })
    );
  };

  const stopMessaging = () => {
    timeouts.forEach((timeout) => window.clearTimeout(timeout));
  };

  const { messageSpy } = mockPostMessage(addEventListener, postMessage);

  return {
    messageSpy,
    changeMsg: (msg) => fakeEvent.push(msg),
    stopMessaging: stopMessaging
  };
};

/**
 * Mock the post message interface
 *
 * so acting on post message will yield no results by default
 * or provide custom implementations
 *
 * @param {function} eventListener window.addEventListener implementation
 * @param {function} messageListener window.postMessage implementation
 */
export const mockPostMessage = (
  eventListener = (_m, _r) => {},
  messageListener = (_m, _r) => {}
) => ({
  eventSpy: jest.spyOn(window, 'addEventListener').mockImplementation(eventListener),
  messageSpy: jest.spyOn(window.parent, 'postMessage').mockImplementation(messageListener)
});

export default stubPostMessage;

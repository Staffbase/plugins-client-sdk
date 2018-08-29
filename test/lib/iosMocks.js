/* eslint-env jest, es6 */

/**
 * Stub the post message interface
 *
 * postMessage will triger the registered message handler directly
 * either with default event mock or the provided msg
 *
 * @param {any} msg to send to the eventListener
 * @param {number} rate the timeout, the postmessage takes to answer
 * @return {function}
 */
const stubPutMessage = (msg = '', rate = 50) => {
  let fakeEvent = msg;
  let interval = 0;

  const answerMessage = () => {
    const putMessageFN =
      window.Staffbase && window.Staffbase.plugins && window.Staffbase.plugins.putMessage;
    putMessageFN(fakeEvent);
  };

  const getMessages = () => {
    const getMessageFN =
      window.Staffbase && window.Staffbase.plugins && window.Staffbase.plugins.getMessages;
    const queue = getMessageFN && getMessageFN();

    if (queue.length) {
      answerMessage();
    }
  };

  const changeMsg = msg => {
    fakeEvent = msg;
  };

  const stopMessaging = () => {
    window.clearInterval(interval);
  };

  interval = window.setInterval(getMessages, rate);

  return {
    changeMsg: changeMsg,
    stopMessaging: stopMessaging
  };
};

export default stubPutMessage;

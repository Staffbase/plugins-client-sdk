import sendMessage from '../../../src/lib/connection/connection.js';
import command from '../../../src/lib/connection/commands.js';

let chai = require('chai');
let expect = chai.expect;

describe('connection', function() {
  describe('sendMessage', () => {
    it('should provide a working sendmesage without a connection', async () => {
      let result = await sendMessage(command.version);
      expect(result).to.be.equal('3.5');
    });
  });
});

/*
 * Mock the post message interface
 *
 * so acting on post message will yield no results by default
 * or provide custom implementations
 *
 * @param {function} cbAEL window.addEventListener implementation
 * @param {function} cbPM window.postMessage implementation
 * /
function mockPostMessage(cbAEL, cbPM) {
  window = {};
  window.parent = {};
  window.addEventListener = cbAEL || function(message, receiveMessage) {};
  window.parent.postMessage = cbPM || function(message, origin) {};
}

/**
 * Stub the post message interface
 *
 * postMessage will triger the registered message handler directly
 * either with default event mock or the provided msg
 *
 * @param {any} msg to send to the eventListener
 * /
function stubPostMessage(msg) {
  let callback = null;
  let fakeEvent = { data: msg || { state: 'platformInfo', info: {} } };
  let addEventListener = (m, cb) => {
    callback = cb;
  };
  let postMessage = (m, o) => {
    callback(fakeEvent);
  };

  mockPostMessage(addEventListener, postMessage);
}
*/

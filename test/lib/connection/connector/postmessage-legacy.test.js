/* eslint-disable no-global-assign */

let chai = require('chai');
let chaiAsPromised = require('chai-as-promised');
let expect = chai.expect;
let sinon = require('sinon');
chai.use(chaiAsPromised);
let sandbox;

import connect from '../../../../src/lib/connection/connector/postmessage-legacy';
import { disconnect } from '../../../../src/lib/connection/connector/postmessage-legacy';
import command from '../../../../src/lib/connection/commands.js';

describe('connector/postmessage-legacy', function() {
  describe('connect', function() {
    beforeEach(function() {
      sandbox = sinon.createSandbox();
      mockPostMessage();
    });

    afterEach(function() {
      disconnect();
      sandbox.restore();
    });

    it('should be a function', () => {
      expect(connect).to.be.a('function');
    });

    it('should yield a Promise', () => {
      let res = connect();
      expect(res).to.be.a('promise');
    });

    it('should use postMessage', () => {
      sandbox.restore();
      sandbox.spy(window.parent, 'postMessage');
      connect();
      expect(window.parent.postMessage.calledOnce).to.be.true;
    });

    it('should send a pluginLoaded message', () => {
      sandbox.restore();
      sandbox.spy(window.parent, 'postMessage');
      connect();
      let firstArg = window.parent.postMessage.getCalls()[0].args[0];
      expect(firstArg).to.equal('pluginLoaded');
    });

    it('should resolve on platformInfo message', () => {
      stubPostMessage();
      return expect(connect()).to.be.fulfilled;
    });

    it('should provide a function', async () => {
      stubPostMessage();
      let fn = await connect();
      return expect(fn).to.be.a('function');
    });

    describe('send function', async () => {
      describe('accepts sdk commands', async function() {
        let mockVersion = '3.5-test';
        let info = {
          state: 'platformInfo',
          info: { native: 'ios', mobile: true, version: mockVersion }
        };

        beforeEach(function() {
          stubPostMessage(info);
        });

        it('should reject on unknown commands', async () => {
          let sendFn = await connect();
          return expect(sendFn('unknown-command')).to.be.rejected;
        });

        describe('accepts all comands', async function() {
          // mock window open
          window.open = function() {};

          let commandData = {
            prefContentLang: ['de_DE', 'en_US']
          };

          for (let cmd in command) {
            if (command.hasOwnProperty(cmd)) {
              it('command.' + cmd, async () => {
                let sendFn = await connect();
                return expect(sendFn(command[cmd], commandData[cmd])).to.be.fulfilled;
              });
            }
          }
        });
      });

      describe('invoke commands', async function() {
        let fileUpload = {
          state: 'finishedImageUploadForPlugin',
          file: true
        };

        beforeEach(function() {
          stubPostMessage(fileUpload);
        });

        it(command.nativeUpload, async () => {
          let sendFn = await connect();
          let nativeUpload = await sendFn(command.nativeUpload);
          expect(nativeUpload).to.equal(true);
        });
      });
    });
  });
});

/**
 * Stub the post message interface
 *
 * postMessage will triger the registered message handler directly
 * either with default event mock or the provided msg
 *
 * @param {any} msg to send to the eventListener
 */
function stubPostMessage(msg) {
  let callback = null;
  let fakeEvent = { data: msg || { state: 'platformInfo', info: {} } };
  let addEventListener = (m, cb) => {
    callback = cb;
  };

  let postMessage = (m, o) => {
    window.setTimeout(() => {
      callback(fakeEvent);
    }, 10);
  };

  mockPostMessage(addEventListener, postMessage);
}

/**
 * Mock the post message interface
 *
 * so acting on post message will yield no results by default
 * or provide custom implementations
 *
 * @param {function} cbAEL window.addEventListener implementation
 * @param {function} cbPM window.postMessage implementation
 */
function mockPostMessage(cbAEL, cbPM) {
  sandbox.restore();
  sandbox.stub(window, 'addEventListener').callsFake(cbAEL || function(message, receiveMessage) {});
  sandbox.stub(window.parent, 'postMessage').callsFake(cbPM || function(message, origin) {});
}

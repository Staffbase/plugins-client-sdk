/* eslint-disable no-global-assign */

let chai = require('chai');
let chaiAsPromised = require('chai-as-promised');
let expect = chai.expect;
let sinon = require('sinon');
chai.use(chaiAsPromised);

import connect from '../../../../src/lib/connection/connector/postmessage-legacy';
import { disconnect } from '../../../../src/lib/connection/connector/postmessage-legacy';
import command from '../../../../src/lib/connection/commands.js';

describe('connector/postmessage-legacy', function() {
  describe('connect', function() {
    beforeEach(function() {
      mockPostMessage();
    });

    afterEach(function() {
      disconnect();
    });

    it('should be a function', () => {
      expect(connect).to.be.a('function');
    });

    it('should yield a Promise', () => {
      let res = connect();
      expect(res).to.be.a('promise');
    });

    it('should use postMessage', () => {
      sinon.spy(window.parent, 'postMessage');
      connect();
      expect(window.parent.postMessage.calledOnce).to.be.true;
    });

    it('should send a pluginLoaded message', () => {
      sinon.spy(window.parent, 'postMessage');
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

        it(command.ios, async () => {
          let sendFn = await connect();
          let ios = await sendFn(command.ios);
          expect(ios).to.equal(true);
        });

        it(command.android, async () => {
          let sendFn = await connect();
          let android = await sendFn(command.android);
          expect(android).to.equal(false);
        });

        it(command.mobile, async () => {
          let sendFn = await connect();
          let mobile = await sendFn(command.mobile);
          expect(mobile).to.equal(true);
        });

        it(command.version, async () => {
          let sendFn = await connect();
          let version = await sendFn(command.version);
          expect(version).to.equal(mockVersion);
        });

        it('throw error on unknown commands', async () => {
          let sendFn = await connect();
          let data = 'Command unknown not supported by driver';

          try {
            await sendFn('unknown');
          } catch (error) {
            expect(error.message).to.equal(data);
          }
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
    callback(fakeEvent);
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
  window = {};
  window.parent = {};
  window.addEventListener = cbAEL || function(message, receiveMessage) {};
  window.parent.postMessage = cbPM || function(message, origin) {};
}

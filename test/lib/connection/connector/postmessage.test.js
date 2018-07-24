/* eslint-disable no-global-assign */

let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');

import connect from '../../../../src/lib/connection/connector/postmessage';
import { disconnect } from '../../../../src/lib/connection/connector/postmessage';
import command from '../../../../src/lib/connection/commands.js';

describe('postmessage', function() {
  describe('connect', function() {
    let sandbox;

    beforeEach(function() {
      disconnect();
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
      sandbox.spy(window.parent, 'postMessage');
      connect();
      expect(window.parent.postMessage.calledOnce).to.be.true;
    });

    it('should send a HELLO message', () => {
      sandbox.spy(window.parent, 'postMessage');
      connect();
      let message = window.parent.postMessage.getCalls()[0].args[0];
      expect(message[0]).to.equal('HELLO');
    });

    it('should resolve on SUCCESS message', async () => {
      stubPostMessage();
      return expect(await connect()).to.be.ok;
    });

    it('should provide a function', async () => {
      stubPostMessage();
      let fn = await connect();
      return expect(fn).to.be.a('function');
    });

    describe('send function', async function() {
      describe('should accept sdk commands', async function() {
        let mockVersion = '3.6-test';
        let info = ['SUCCESS', 0, { native: 'ios', mobile: true, version: mockVersion }];
        let responseSpy;

        beforeEach(() => {
          sandbox = sinon.createSandbox();
          responseSpy = sandbox.stub();
          stubPostMessage(responseSpy.onFirstCall().returns(info));
        });

        afterEach(() => {
          disconnect();
          sandbox.restore();
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

      describe('should send invoke commands', async function() {
        let mockVersion = '3.6-test';
        let info = ['SUCCESS', 0, { native: 'ios', mobile: true, version: mockVersion }];
        let responseSpy;

        beforeEach(() => {
          sandbox = sinon.createSandbox();
          responseSpy = sandbox.stub();
          stubPostMessage(responseSpy.onFirstCall().returns(info));
        });

        afterEach(() => {
          disconnect();
          sandbox.restore();
        });

        xit(command.openLink, async () => {
          let sendFn = await connect();
          let data = 'Link opened';
          let success = ['SUCCESS', 1, data];

          responseSpy.onSecondCall().returns(success);
          let result = await sendFn(command.openLink, 'http://staffbase.com');

          expect(result).to.equal(data);
        });

        xit('reject on error', async () => {
          let sendFn = await connect();
          let data = 'No url set.';
          let error = ['ERROR', 1, data];

          responseSpy.onSecondCall().returns(error);

          try {
            await sendFn(command.openLink, 'http://staffbase.com');
            /* eslint-disable no-undef */
            done(new Error('it did not throw'));
          } catch (error) {
            expect(error).to.equal(data);
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
  let mockVersion = '3.6-test';
  let callback = null;
  let fakeEvent = [
    'SUCCESS',
    0,
    { platform: { native: 'ios', mobile: true, version: mockVersion } }
  ];
  let addEventListener = (m, cb) => {
    callback = cb;
  };
  let postMessage = (m, o) => {
    // forwards correct message id
    fakeEvent[1] = m[1];
    callback({ data: fakeEvent });
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

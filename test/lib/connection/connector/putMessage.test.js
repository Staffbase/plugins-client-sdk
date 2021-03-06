/* eslint-disable no-global-assign */
/* eslint-env jest, es6 */

import connect from '../../../../src/lib/connection/connector/putMessage';
import { disconnect } from '../../../../src/lib/connection/connector/putMessage';
import stubPutMessage from '../../iosMocks';
import command from '../../../../src/lib/connection/commands.js';
import genId from '../../../../src/lib/utils/genId';
import { unload as unloadManager } from '../../../../src/lib/connection/manager';

jest.mock('../../../../src/lib/utils/genId');

const mockVersion = '3.6-dev';
const info = { native: 'ios', mobile: true, version: mockVersion };

const language = { branchDefaultLanguage: 'de_DE' };

const welcomeMessage = ['SUCCESS', 'abcd', { platform: info, language: language }];

describe('putmessage', () => {
  describe('connect', () => {
    let messageMock;

    beforeEach(() => {
      genId.mockReturnValue('abcd');
      messageMock = stubPutMessage(welcomeMessage);
    });

    afterEach(() => {
      messageMock.stopMessaging();
      disconnect();
      unloadManager();
    });

    it('should be a function', () => {
      expect(connect).toBeFunction();
    });

    it('should yield a Promise', () => {
      const res = connect();
      expect(res instanceof Promise).toBeTrue();
    });

    it('should install handler functions', () => {
      connect();
      expect(window.Staffbase.plugins.getMessages).toBeFunction();
      expect(window.Staffbase.plugins.putMessage).toBeFunction();
    });

    it('should send a HELLO message', () => {
      connect();
      const message = window.Staffbase.plugins.getMessages();
      expect(message[0][0]).toEqual('HELLO');
    });

    it('should resolve on SUCCESS message', async () => {
      return expect(await connect()).toBe.ok;
    });

    it('should provide a function', async () => {
      const fn = await connect();
      return expect(fn).toBeFunction();
    });

    describe('send function', () => {
      describe('should accept sdk commands', () => {
        it(command.ios, async () => {
          const sendFn = await connect();
          const ios = await sendFn(command.ios);
          expect(ios).toBeTrue();
        });

        it(command.android, async () => {
          const sendFn = await connect();
          const android = await sendFn(command.android);
          expect(android).toBeFalse();
        });

        it(command.mobile, async () => {
          const sendFn = await connect();
          const mobile = await sendFn(command.mobile);
          expect(mobile).toBeTrue();
        });

        it(command.version, async () => {
          const sendFn = await connect();
          const version = await sendFn(command.version);
          expect(version).toEqual(mockVersion);
        });

        it('throw error on unknown commands', async () => {
          const sendFn = await connect();
          const data = 'Command unknown not supported by driver';

          try {
            await sendFn('unknown');
          } catch (error) {
            expect(error.message).toEqual(data);
          }
        });
      });

      describe('should send invoke commands', () => {
        it(command.openLink, async () => {
          const sendFn = await connect();
          const data = 'Link opened';
          const success = ['SUCCESS', 'ff33', data];

          genId.mockReturnValue('ff33');
          messageMock.changeMsg(success);
          const result = await sendFn(command.openLink, 'http://staffbase.com');

          expect(result).toEqual(data);
        });

        it('reject on error', async () => {
          const sendFn = await connect();
          const data = 'No url set.';
          const error = ['ERROR', 'ff33', data];

          genId.mockReturnValue('ff33');
          messageMock.changeMsg(error);
          expect(sendFn(command.openLink, 'http://staffbase.com')).rejects.toEqual(data);
        });
      });
    });
  });
});

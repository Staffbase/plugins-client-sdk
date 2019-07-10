/* eslint-disable no-global-assign */
/* eslint-env jest, es6 */

import stubPostMessage, { mockPostMessage } from '../../mocks';
import connect from '../../../../src/lib/connection/connector/postmessage';
import { disconnect } from '../../../../src/lib/connection/connector/postmessage';
import command from '../../../../src/lib/connection/commands.js';
import { unload as unloadManager } from '../../../../src/lib/connection/manager';

import genId from '../../../../src/lib/utils/genId';

jest.mock('../../../../src/lib/utils/genId');
const mockVersion = '3.6-dev';
const standardMsg = [
  'SUCCESS',
  0,
  {
    platform: { native: 'ios', mobile: true, version: mockVersion },
    language: {
      branchLanguages: {
        de: {
          key: 'de',
          locale: 'de_DE',
          name: 'Deutsch',
          localizedName: 'Deutsch'
        },
        en: {
          key: 'en',
          locale: 'en_US',
          name: 'English',
          localizedName: 'Englisch'
        }
      }
    }
  }
];

describe('postmessage', () => {
  describe('connect', () => {
    beforeEach(() => {
      disconnect();
      mockPostMessage();
    });

    afterEach(() => {
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

    it('should use postMessage', () => {
      jest.spyOn(window.parent, 'postMessage');
      connect();
      expect(window.parent.postMessage).toHaveBeenCalledTimes(1);
    });

    it('should send a HELLO message', () => {
      jest.spyOn(window.parent, 'postMessage');
      connect();
      const message = window.parent.postMessage.mock.calls[0][0];
      expect(message[0]).toEqual('HELLO');
    });

    it('should resolve on SUCCESS message', async () => {
      stubPostMessage(standardMsg);
      return expect(await connect()).toBe.ok;
    });

    it('should provide a function', async () => {
      stubPostMessage(standardMsg);
      const fn = await connect();
      return expect(fn).toBeFunction();
    });

    describe('send function', () => {
      describe('should accept sdk commands', () => {
        beforeEach(() => {
          stubPostMessage(standardMsg);
        });

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
        let responseSpy;

        beforeEach(() => {
          responseSpy = stubPostMessage(standardMsg);
        });

        it(command.openLink, async () => {
          const sendFn = await connect();
          const data = 'Link opened';
          const success = ['SUCCESS', 'ff22', data];

          genId.mockReturnValue('ff22');
          responseSpy.changeMsg(success);
          const result = await sendFn(command.openLink, 'http://staffbase.com');

          expect(result).toEqual(data);
        });

        it('reject on error', async () => {
          const sendFn = await connect();
          const data = 'No url set.';
          const error = ['ERROR', 'ff22', data];

          genId.mockReturnValue('ff22');
          responseSpy.changeMsg(error);
          expect(sendFn(command.openLink, 'http://staffbase.com')).rejects.toEqual(data);
        });
      });
    });
  });
});

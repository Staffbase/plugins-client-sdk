/* eslint-env jest, es6 */

import { canDownload } from '../../src/lib/device';
import connect, { disconnect } from '../../src/lib/connection/connector/fallback';
import * as App from './../../src/lib/app';
import * as FallbackHandler from './../../src/lib/connection/connector/fallback-handlers';

describe('device', () => {
  describe('canDownload', () => {
    const isNativeStub = jest.spyOn(App, 'isNative');
    const getVersionStub = jest.spyOn(App, 'getVersion');
    const isIosStub = jest.spyOn(FallbackHandler, 'isIos');
    beforeEach(() => {
      disconnect();
    });

    test('should return that the device can download', async () => {
      await connect();
      isNativeStub.mockReturnValue(false);
      getVersionStub.mockReturnValue('3.4');
      isIosStub.mockReturnValue(false);
      const result = await canDownload();
      expect(result).toBeTruthy();
    });

    test('should return that the device can not download', async () => {
      await connect();
      isNativeStub.mockReturnValue(true);
      getVersionStub.mockReturnValue('3.4');
      isIosStub.mockReturnValue(true);
      const result = await canDownload();
      expect(result).toBeFalsy();
    });

    test('should return that the device can download with development version', async () => {
      await connect();
      isNativeStub.mockReturnValue(true);
      getVersionStub.mockReturnValue('3.6-dev');
      isIosStub.mockReturnValue(true);
      const result = await canDownload();
      expect(result).toBeTruthy();
    });
  });
});

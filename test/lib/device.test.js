import { canDownload } from '../../src/lib/device';
import connect, { disconnect } from '../../src/lib/connection/connector/fallback';
import * as App from './../../src/lib/app';
import * as FallbackHandler from './../../src/lib/connection/connector/fallback-handlers';

let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');

describe('device', function() {
  describe('canDownload', () => {
    let isNativeStub = sinon.stub(App, 'isNative');
    let getVersionStub = sinon.stub(App, 'getVersion');
    let isIosStub = sinon.stub(FallbackHandler, 'isIos');
    beforeEach(function() {
      disconnect();
    });

    it('should return that the device can download', async () => {
      await connect();
      isNativeStub.returns(false);
      getVersionStub.returns('3.4');
      isIosStub.returns(false);
      let result = await canDownload();
      expect(result).to.be.true;
    });

    it('should return that the device can not download', async () => {
      await connect();
      isNativeStub.returns(true);
      getVersionStub.returns('3.4');
      isIosStub.returns(true);
      let result = await canDownload();
      expect(result).to.be.false;
    });

    it('should return that the device can download with development version', async () => {
      await connect();
      isNativeStub.returns(true);
      getVersionStub.returns('3.6-dev');
      isIosStub.returns(true);
      let result = await canDownload();
      expect(result).to.be.true;
    });
  });
});

/* eslint-env jest, es6 */

import stubPostMessage from './mocks';
import { disconnect } from '../../src/lib/connection/connection';
import * as App from './../../src/lib/app';

const branchLanguages = {
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
};
const langInfos = {
  contentLanguage: branchLanguages.de,
  branchLanguages: branchLanguages,
  branchDefaultLanguage: branchLanguages.de,
  deviceLanguage: branchLanguages.en,
  contentLanguages: branchLanguages
};

const mockVersion = '3.6-dev';
const standardMsg = [
  'SUCCESS',
  'abc2',
  {
    platform: { native: 'ios', mobile: true, version: mockVersion },
    language: langInfos
  }
];

const langInfoMsg = ['SUCCESS', 'abc2', langInfos];

describe('app', () => {
  let messageStub;
  beforeEach(() => {
    messageStub = stubPostMessage(standardMsg);
  });

  afterEach(() => {
    disconnect();
  });

  it('should return the app version', async () => {
    expect(await App.getVersion()).toEqual(mockVersion);
  });

  it('should check if mobile', async () => {
    expect(await App.isMobile()).toEqual(true);
  });

  it('should check if native', async () => {
    expect(await App.isNative()).toEqual(true);
  });

  it('should get the branch languages', async () => {
    messageStub.changeMsg(langInfoMsg);
    expect(await App.getBranchLanguages()).toEqual(branchLanguages);
  });

  it('should get the default branch language', async () => {
    messageStub.changeMsg(langInfoMsg);
    expect(await App.getBranchDefaultLanguage()).toEqual(langInfos.branchDefaultLanguage);
  });

  it('should get the content languages', async () => {
    messageStub.changeMsg(langInfoMsg);
    expect(await App.getContentLanguages()).toEqual(langInfos.contentLanguages);
  });

  it('should get the preferred content language', async () => {
    messageStub.changeMsg(['SUCCESS', 0, 'de_DE']);
    expect(await App.getPreferredContentLocale(['de_DE', 'EN_US'])).toEqual('de_DE');
  });

  it('should open links', async () => {
    messageStub.changeMsg(['SUCCESS', 0, true]);
    expect(await App.openLink('https://test.de')).toEqual(true);
    expect(await App.openLinkExternal('https://test.de')).toEqual(true);
    expect(await App.openLinkInternal('https://test.de')).toEqual(true);
  });

  it('should native file dialog', async () => {
    messageStub.changeMsg(['SUCCESS', 0, true]);
    expect(await App.openNativeFileDialog()).toEqual(true);
  });
});

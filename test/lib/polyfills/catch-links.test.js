/* eslint-disable no-global-assign */

let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');

import linkCatcher from '../../../src/lib/polyfills/catch-links';

describe('catch-links', function() {
  let sandbox;
  let globalCallbackSpy;

  const nestedStructureWithoutLink = `
    <div>
        <div>
            <div id="clickElement"></div>
        </div>
    </div>`;

  const nestedStructureWithLinks = `
    <div>
        <div>
            <a id="anchorEmpty" href="/"></a>
        </div>
        <div>
            <a id="anchorBlank" href="/" target="_blank"></a>
        </div>
        <div>
            <a id="anchorDomain" href="https://other.domain"></a>
        </div>
        <div>
            <a id="anchorClickOpen" href="/"></a>
        </div>
    </div>`;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    globalCallbackSpy = sandbox.spy();
    mockWindowEnv();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should add a click event handler', () => {
    const element = document.createElement('div');
    const addEventListenerSpy = sandbox.spy();
    element.addEventListener = addEventListenerSpy;

    linkCatcher(element, globalCallbackSpy);
    expect(addEventListenerSpy.getCall(0).args[0]).to.equal('click');
  });

  it('should do nothing if no anchor is clicked', () => {
    const element = document.createElement('div');
    element.innerHTML = nestedStructureWithoutLink;
    const clickElement = element.querySelector('#clickElement');

    linkCatcher(element, globalCallbackSpy);

    eventFire(clickElement, 'click');

    expect(globalCallbackSpy.called).to.be.false;
  });

  it('should do nothing if link is local', () => {
    const element = document.createElement('div');
    element.innerHTML = nestedStructureWithLinks;
    const clickElement = element.querySelector('#anchorEmpty');

    linkCatcher(element, globalCallbackSpy);

    eventFire(clickElement, 'click');

    expect(globalCallbackSpy.called).to.be.false;
  });

  it('should invoke callback if link has target _blank', () => {
    const element = document.createElement('div');
    element.innerHTML = nestedStructureWithLinks;
    const clickElement = element.querySelector('#anchorBlank');

    linkCatcher(element, globalCallbackSpy);

    eventFire(clickElement, 'click');

    expect(globalCallbackSpy.called).to.be.true;
  });

  xit('should invoke callback if link is external', () => {
    const element = document.createElement('div');
    element.innerHTML = nestedStructureWithLinks;
    const clickElement = element.querySelector('#anchorDomain');

    linkCatcher(element, globalCallbackSpy);

    eventFire(clickElement, 'click');

    expect(globalCallbackSpy.called).to.be.true;
  });

  // Disabled as the callback is somehow not set correctly
  xit('should invoke callback if link open via onclick handler', () => {
    const element = document.createElement('div');

    element.innerHTML = nestedStructureWithLinks;
    const clickElement = element.querySelector('#anchorClickOpen');

    clickElement.addEventListener('click', () => {
      window.open('https://other.domain');
    });

    linkCatcher(element, globalCallbackSpy);

    eventFire(clickElement, 'click');

    expect(globalCallbackSpy.called).to.be.true;
  });
});

/**
 * Triggers an event on the given element
 *
 * @param {HTMLElement} el element
 * @param {string} etype event type
 */
function eventFire(el, etype) {
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    let evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

/**
 * Mock the window functions open and Timeout
 *
 */
function mockWindowEnv() {
  window = {};
  window.open = () => true;
  window.setTimeout = setTimeout;
}

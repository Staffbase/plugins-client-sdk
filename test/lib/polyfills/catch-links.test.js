/* eslint-disable no-global-assign */
/* eslint-env jest, es6 */

import linkCatcher from '../../../src/lib/polyfills/catch-links';

describe('catch-links', () => {
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

  beforeEach(() => {
    globalCallbackSpy = jest.fn();
    mockWindowEnv();
  });

  afterEach(() => {});

  test('should add a click event handler', () => {
    const element = document.createElement('div');
    const addEventListenerSpy = jest.fn();
    element.addEventListener = addEventListenerSpy;

    linkCatcher(element, globalCallbackSpy);
    expect(addEventListenerSpy.mock.calls[0][0]).toBe('click');
  });

  test('should do nothing if no anchor is clicked', () => {
    const element = document.createElement('div');
    element.innerHTML = nestedStructureWithoutLink;
    const clickElement = element.querySelector('#clickElement');

    linkCatcher(element, globalCallbackSpy);

    eventFire(clickElement, 'click');

    expect(globalCallbackSpy.mock.calls.length).toBe.false;
  });

  test('should do nothing if link is local', () => {
    const element = document.createElement('div');
    element.innerHTML = nestedStructureWithLinks;
    const clickElement = element.querySelector('#anchorEmpty');

    linkCatcher(element, globalCallbackSpy);

    eventFire(clickElement, 'click');

    expect(globalCallbackSpy.mock.calls.length).toBe.false;
  });

  test('should invoke callback if link has target _blank', () => {
    const element = document.createElement('div');
    element.innerHTML = nestedStructureWithLinks;
    const clickElement = element.querySelector('#anchorBlank');

    linkCatcher(element, globalCallbackSpy);

    eventFire(clickElement, 'click');

    expect(globalCallbackSpy.mock.calls.length).toBe.true;
  });

  test('should invoke callback if link is external', () => {
    const element = document.createElement('div');
    element.innerHTML = nestedStructureWithLinks;
    const clickElement = element.querySelector('#anchorDomain');

    linkCatcher(element, globalCallbackSpy);

    eventFire(clickElement, 'click');

    expect(globalCallbackSpy.mock.calls.length).toBe.true;
  });

  // Disabled as the callback is somehow not set correctly
  test('should invoke callback if link open via onclick handler', () => {
    const element = document.createElement('div');

    element.innerHTML = nestedStructureWithLinks;
    const clickElement = element.querySelector('#anchorClickOpen');

    clickElement.addEventListener('click', () => {
      window.open('https://other.domain');
    });

    linkCatcher(element, globalCallbackSpy);

    eventFire(clickElement, 'click');

    expect(globalCallbackSpy.mock.calls.length).toBe.true;
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

import { scrollIntoViewContained, installScrollContainment } from '../../src/lib/scroll';

const VIEWPORT = 600;

/**
 * jsdom has no layout, so the scroll geometry is described by hand: every scroller
 * has a client size, a scroll size and a scroll position, and an element's rect is
 * its document position minus the scroll positions of its scrollers.
 */
const makeScroller = (node, { client, scroll }) => {
  let top = 0;
  let left = 0;
  Object.defineProperties(node, {
    clientHeight: { value: client, configurable: true },
    scrollHeight: { value: scroll, configurable: true },
    clientWidth: { value: 400, configurable: true },
    scrollWidth: { value: 400, configurable: true },
    clientTop: { value: 0, configurable: true },
    clientLeft: { value: 0, configurable: true },
    scrollTop: {
      get: () => top,
      set: (v) => {
        top = v;
      },
      configurable: true
    },
    scrollLeft: {
      get: () => left,
      set: (v) => {
        left = v;
      },
      configurable: true
    }
  });
  node.scrollBy = jest.fn(({ top: dy = 0, left: dx = 0 }) => {
    node.scrollTop += dy;
    node.scrollLeft += dx;
  });
};

const makeElement = (parent, docTop, height, scrollers) => {
  const el = document.createElement('div');
  parent.appendChild(el);
  el.getClientRects = () => [{}];
  el.getBoundingClientRect = () => {
    const top = docTop - scrollers.reduce((sum, s) => sum + s.scrollTop, 0);
    return { top, bottom: top + height, left: 0, right: 100 };
  };
  return el;
};

let styles;

beforeEach(() => {
  styles = new Map();
  jest.spyOn(window, 'getComputedStyle').mockImplementation((node) => styles.get(node) || {});
  Object.defineProperty(document, 'scrollingElement', {
    value: document.documentElement,
    configurable: true
  });
  document.body.innerHTML = '';
  makeScroller(document.documentElement, { client: VIEWPORT, scroll: 5000 });
  document.documentElement.scrollTop = 0;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('scrollIntoViewContained', () => {
  const root = () => document.documentElement;

  test.each([
    ['start', undefined, 1000],
    ['start', { block: 'start' }, 1000],
    ['end', { block: 'end' }, 1000 + 100 - VIEWPORT],
    ['center', { block: 'center' }, 1050 - VIEWPORT / 2],
    ['nearest below the view', { block: 'nearest' }, 1000 + 100 - VIEWPORT]
  ])('aligns to the %s', (_name, arg, expected) => {
    const el = makeElement(document.body, 1000, 100, [root()]);
    scrollIntoViewContained(el, arg);
    expect(root().scrollTop).toBe(expected);
  });

  test('treats `false` like block end', () => {
    const el = makeElement(document.body, 1000, 100, [root()]);
    scrollIntoViewContained(el, false);
    expect(root().scrollTop).toBe(1100 - VIEWPORT);
  });

  test('does not move for a visible element with block nearest', () => {
    const el = makeElement(document.body, 100, 50, [root()]);
    scrollIntoViewContained(el, { block: 'nearest' });
    expect(root().scrollBy).not.toHaveBeenCalled();
  });

  test('aligns a visible element to the top for block start', () => {
    root().scrollTop = 80;
    const el = makeElement(document.body, 200, 50, [root()]);
    scrollIntoViewContained(el, { block: 'start' });
    expect(root().scrollTop).toBe(200);
  });

  test('clamps to the scrollable range', () => {
    const el = makeElement(document.body, 4900, 100, [root()]);
    scrollIntoViewContained(el, { block: 'start' });
    expect(root().scrollTop).toBe(5000 - VIEWPORT);
  });

  test('honours scroll-margin and scroll-padding', () => {
    const el = makeElement(document.body, 1000, 100, [root()]);
    styles.set(el, { scrollMarginTop: '88px' });
    styles.set(root(), { scrollPaddingTop: '12px' });
    scrollIntoViewContained(el, { block: 'start' });
    expect(root().scrollTop).toBe(1000 - 88 - 12);
  });

  test('passes smooth behavior on and leaves `auto` to CSS', () => {
    const el = makeElement(document.body, 1000, 100, [root()]);
    scrollIntoViewContained(el, { behavior: 'smooth' });
    expect(root().scrollBy).toHaveBeenCalledWith({ top: 1000, left: 0, behavior: 'smooth' });

    root().scrollBy.mockClear();
    root().scrollTop = 0;
    scrollIntoViewContained(el, { behavior: 'auto' });
    expect(root().scrollBy).toHaveBeenCalledWith({ top: 1000, left: 0 });
  });

  test('scrolls an inner container first, then the document with the remaining distance', () => {
    const list = makeElement(document.body, 700, 300, [root()]);
    styles.set(list, { overflowY: 'auto', position: 'static' });
    makeScroller(list, { client: 300, scroll: 2000 });
    const el = makeElement(list, 1500, 50, [list, root()]);

    scrollIntoViewContained(el, { block: 'start' });

    // the list is limited by its own box, the rest of the distance goes to the document
    expect(list.scrollTop).toBe(800);
    expect(root().scrollTop).toBe(700);
  });

  test('also scrolls overflow:hidden containers, like the native method', () => {
    const box = makeElement(document.body, 0, 300, [root()]);
    styles.set(box, { overflowY: 'hidden' });
    makeScroller(box, { client: 300, scroll: 900 });
    const el = makeElement(box, 600, 50, [box, root()]);
    scrollIntoViewContained(el, { block: 'start' });
    expect(box.scrollTop).toBe(600);
  });

  test('ignores containers that do not overflow', () => {
    const box = makeElement(document.body, 0, 300, [root()]);
    styles.set(box, { overflowY: 'auto' });
    makeScroller(box, { client: 300, scroll: 300 });
    const el = makeElement(box, 1000, 50, [box, root()]);
    scrollIntoViewContained(el, { block: 'start' });
    expect(box.scrollBy).not.toHaveBeenCalled();
    expect(root().scrollTop).toBe(1000);
  });

  test('does not scroll past a fixed-position ancestor', () => {
    const panel = makeElement(document.body, 0, 300, [root()]);
    styles.set(panel, { position: 'fixed', overflowY: 'auto' });
    makeScroller(panel, { client: 300, scroll: 900 });
    const el = makeElement(panel, 600, 50, [panel]);
    scrollIntoViewContained(el, { block: 'start' });
    expect(panel.scrollTop).toBe(600);
    expect(root().scrollBy).not.toHaveBeenCalled();
  });

  test('does nothing for an element that is not rendered', () => {
    const el = makeElement(document.body, 1000, 100, [root()]);
    el.getClientRects = () => [];
    scrollIntoViewContained(el);
    expect(root().scrollBy).not.toHaveBeenCalled();
  });

  test('scrolls horizontally with the inline option', () => {
    Object.defineProperty(root(), 'scrollWidth', { value: 2000, configurable: true });
    Object.defineProperty(root(), 'clientWidth', { value: 400, configurable: true });
    const el = document.createElement('div');
    document.body.appendChild(el);
    el.getClientRects = () => [{}];
    el.getBoundingClientRect = () => ({
      top: 0,
      bottom: 10,
      left: 900 - root().scrollLeft,
      right: 1000 - root().scrollLeft
    });
    scrollIntoViewContained(el, { block: 'nearest', inline: 'start' });
    expect(root().scrollLeft).toBe(900);
  });
});

describe('installScrollContainment', () => {
  const originalParent = Object.getOwnPropertyDescriptor(window, 'parent');
  const original = window.Element.prototype.scrollIntoView;

  const embed = () => Object.defineProperty(window, 'parent', { value: {}, configurable: true });

  afterEach(() => {
    if (originalParent) Object.defineProperty(window, 'parent', originalParent);
    else delete window.parent;
    window.Element.prototype.scrollIntoView = original;
  });

  test('leaves the native method alone outside a frame', () => {
    window.Element.prototype.scrollIntoView = jest.fn();
    const native = window.Element.prototype.scrollIntoView;
    installScrollContainment();
    expect(window.Element.prototype.scrollIntoView).toBe(native);
  });

  test('replaces scrollIntoView inside a frame', () => {
    window.Element.prototype.scrollIntoView = jest.fn();
    const native = window.Element.prototype.scrollIntoView;
    embed();

    installScrollContainment();
    expect(window.Element.prototype.scrollIntoView).not.toBe(native);

    const el = makeElement(document.body, 1000, 100, [document.documentElement]);
    el.scrollIntoView({ block: 'start' });
    expect(native).not.toHaveBeenCalled();
    expect(document.documentElement.scrollTop).toBe(1000);
  });

  test('installs once and restores the original', () => {
    window.Element.prototype.scrollIntoView = jest.fn();
    const native = window.Element.prototype.scrollIntoView;
    embed();

    const restore = installScrollContainment();
    const patched = window.Element.prototype.scrollIntoView;
    installScrollContainment();
    expect(window.Element.prototype.scrollIntoView).toBe(patched);

    restore();
    expect(window.Element.prototype.scrollIntoView).toBe(native);
  });
});

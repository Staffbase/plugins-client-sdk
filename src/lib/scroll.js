import log from 'loglevel';

const SCROLL_PARENT_OVERFLOW = /^(auto|scroll|overlay|hidden)$/;
const INSTALLED_MARKER = '__staffbaseScrollContainment';

const AXES = {
  block: {
    start: 'top',
    end: 'bottom',
    size: 'height',
    clientSize: 'clientHeight',
    scrollSize: 'scrollHeight',
    scrollPos: 'scrollTop',
    overflow: 'overflowY',
    marginStart: 'scrollMarginTop',
    marginEnd: 'scrollMarginBottom',
    paddingStart: 'scrollPaddingTop',
    paddingEnd: 'scrollPaddingBottom',
    clientStart: 'clientTop'
  },
  inline: {
    start: 'left',
    end: 'right',
    size: 'width',
    clientSize: 'clientWidth',
    scrollSize: 'scrollWidth',
    scrollPos: 'scrollLeft',
    overflow: 'overflowX',
    marginStart: 'scrollMarginLeft',
    marginEnd: 'scrollMarginRight',
    paddingStart: 'scrollPaddingLeft',
    paddingEnd: 'scrollPaddingRight',
    clientStart: 'clientLeft'
  }
};

const px = (value) => parseFloat(value) || 0;

const normalizeOptions = (arg) => {
  if (arg === false) return { block: 'end', inline: 'nearest', behavior: 'auto' };
  if (arg && typeof arg === 'object') {
    return {
      block: arg.block || 'start',
      inline: arg.inline || 'nearest',
      behavior: arg.behavior || 'auto'
    };
  }
  return { block: 'start', inline: 'nearest', behavior: 'auto' };
};

/**
 * How far the scroller has to move to bring the element's span into its view, per the
 * CSSOM View alignment rules for `start`, `end`, `center` and `nearest`.
 */
const alignDelta = (align, start, end, viewStart, viewEnd) => {
  switch (align) {
    case 'end':
      return end - viewEnd;
    case 'center':
      return (start + end) / 2 - (viewStart + viewEnd) / 2;
    case 'nearest': {
      const size = end - start;
      const viewSize = viewEnd - viewStart;
      const startOutside = start < viewStart;
      const endOutside = end > viewEnd;
      if (startOutside && endOutside) return 0;
      if ((startOutside && size < viewSize) || (endOutside && size > viewSize)) {
        return start - viewStart;
      }
      if ((endOutside && size < viewSize) || (startOutside && size > viewSize)) {
        return end - viewEnd;
      }
      return 0;
    }
    default:
      return start - viewStart;
  }
};

const propagatesToViewport = (node, rootElement) => {
  const doc = node.ownerDocument;
  return (
    node === doc.body &&
    node !== rootElement &&
    window.getComputedStyle(doc.documentElement).overflowY === 'visible'
  );
};

const canScroll = (node, axis, rootElement) => {
  if (node[axis.scrollSize] <= node[axis.clientSize]) return false;
  if (propagatesToViewport(node, rootElement)) return false;
  return (
    node === rootElement ||
    SCROLL_PARENT_OVERFLOW.test(window.getComputedStyle(node)[axis.overflow])
  );
};

const viewBox = (node, axis, rootElement) => {
  if (node === rootElement) return { start: 0, size: node[axis.clientSize] };
  const rect = node.getBoundingClientRect();
  return { start: rect[axis.start] + node[axis.clientStart], size: node[axis.clientSize] };
};

/**
 * Scrolls every scroll container between the element and the document, but never the
 * frames around it.
 *
 * `Element.scrollIntoView` also scrolls the page that embeds the plugin's iframe, even across
 * origins. In the Staffbase app the page scrolls once a footer is configured, so a call such as
 * `heading.scrollIntoView()` moves the host page under its header. This helper moves only the
 * plugin's own content.
 *
 * Takes the same arguments as `Element.scrollIntoView`.
 *
 * @example
 *   scrollIntoViewContained(document.getElementById('letter-M'), { block: 'start' });
 *
 * @param {Element} element the element to bring into view
 * @param {boolean|object} [arg] `alignToTop` flag or `{ block, inline, behavior }` options
 * @return {void}
 */
export const scrollIntoViewContained = (element, arg) => {
  log.debug('scroll/scrollIntoViewContained');
  const doc = element.ownerDocument;
  const rootElement = doc.scrollingElement || doc.documentElement;
  if (!element.getClientRects().length) return;

  const options = normalizeOptions(arg);
  const behavior = options.behavior === 'auto' ? undefined : options.behavior;
  const rect = element.getBoundingClientRect();
  const elementStyle = window.getComputedStyle(element);
  const rtl = window.getComputedStyle(doc.documentElement).direction === 'rtl';

  // Rect of the element as scrolling moves it; scrolling a container by d moves it by -d.
  const span = {
    block: { start: rect.top, end: rect.bottom },
    inline: { start: rect.left, end: rect.right }
  };
  const pending = [];

  let node = element.parentElement;
  while (node) {
    const delta = {};
    for (const axisName of ['block', 'inline']) {
      const axis = AXES[axisName];
      if (!canScroll(node, axis, rootElement)) continue;

      const box = viewBox(node, axis, rootElement);
      const containerStyle = window.getComputedStyle(
        node === rootElement ? doc.documentElement : node
      );
      let align = options[axisName];
      if (axisName === 'inline' && rtl && (align === 'start' || align === 'end')) {
        align = align === 'start' ? 'end' : 'start';
      }
      const wanted = alignDelta(
        align,
        span[axisName].start - px(elementStyle[axis.marginStart]),
        span[axisName].end + px(elementStyle[axis.marginEnd]),
        box.start + px(containerStyle[axis.paddingStart]),
        box.start + box.size - px(containerStyle[axis.paddingEnd])
      );

      const max = node[axis.scrollSize] - node[axis.clientSize];
      const [min, top] = axisName === 'inline' && rtl ? [-max, 0] : [0, max];
      const applied =
        Math.min(top, Math.max(min, node[axis.scrollPos] + wanted)) - node[axis.scrollPos];
      if (applied) {
        delta[axisName] = applied;
        span[axisName].start -= applied;
        span[axisName].end -= applied;
      }
    }
    if (delta.block || delta.inline) pending.push({ target: node, delta });
    const isFixed = window.getComputedStyle(node).position === 'fixed';
    if (isFixed || node === rootElement || node === doc.documentElement) break;
    node = node.parentElement;
  }

  pending.forEach(({ target, delta }) => {
    const move = { top: delta.block || 0, left: delta.inline || 0 };
    if (typeof target.scrollBy === 'function') {
      target.scrollBy(behavior ? Object.assign({}, move, { behavior }) : move);
    } else {
      target.scrollTop += move.top;
      target.scrollLeft += move.left;
    }
  });
};

/**
 * Makes `Element.prototype.scrollIntoView` leave the page around the plugin alone.
 *
 * Call it once at startup. Libraries that scroll with `scrollIntoView` (dropdowns, comboboxes,
 * focus handling) are covered too. It does nothing when the plugin is not inside a frame.
 *
 * @example
 *   installScrollContainment();
 *
 * @return {function(): void} restores the original `scrollIntoView`
 */
export const installScrollContainment = () => {
  log.debug('scroll/installScrollContainment');
  const noop = () => {};
  if (window.parent === window) return noop;

  const proto = window.Element.prototype;
  const original = proto.scrollIntoView;
  if (typeof original !== 'function' || original[INSTALLED_MARKER]) return noop;

  const contained = function scrollIntoView(arg) {
    scrollIntoViewContained(this, arg);
  };
  contained[INSTALLED_MARKER] = true;
  proto.scrollIntoView = contained;

  return () => {
    if (proto.scrollIntoView === contained) proto.scrollIntoView = original;
  };
};

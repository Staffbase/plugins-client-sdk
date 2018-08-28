/**
 * parse a url and test if the hostname differs from the location host
 *
 * @param {string} url the url string
 * @return {boolean}
 */
const isExternalLink = url => {
  try {
    // if the url string is no valid URI, this throws an error
    let u = window.URL && new URL(url);

    if (u.hostname && u.hostname !== location.host) {
      return true;
    }
  } catch (e) {} // eslint-disable-line no-empty

  return false;
};

/**
 * Replaces the given open function with another function
 *
 * @param {function} open the original open function
 * @param {function} cb the callback which get called instead of
 *
 * @return {{stop: function}} reenables the original function
 */
const replaceWindowOpen = (open, cb) => {
  const windowOpen = (url, windowName, windowFeatures) => {
    if (isExternalLink(url)) {
      cb(url);
    } else {
      open(url, windowName, windowFeatures);
    }
  };

  window.open = windowOpen;

  return {
    stop: () => (window.open = open)
  };
};

/**
 * Adds a click event listener which tests for a click on an anchor element
 * with an external link and calls a function to handle the link
 *
 * @param {HTMLElement} root the node to add the event handler to
 * @param {function} cb The callback which is called when the link is external
 *
 */
const linkCatcher = (root, cb) => {
  /**
   * Tests if the event target is an anchor element and if the url is
   * an external link
   *
   * @param {MouseEvent} ev the click event
   * @return {boolean}
   */
  const clickHandler = ev => {
    if (ev.defaultPrevented) {
      return true;
    }

    /** @type {HTMLAnchorElement?} */
    let anchor = null;

    for (let n = ev.target; n.parentNode; n = n.parentNode) {
      if (n.nodeName === 'A') {
        anchor = n;
        break;
      }
    }

    if (!anchor) return true;

    let href = anchor.getAttribute('href');

    if (anchor.getAttribute('target') === '_blank') {
      ev.preventDefault();
      cb(href);
      return false;
    }

    if (isExternalLink(href)) {
      ev.preventDefault();
      cb(href);
      return false;
    }

    const windowOpenReplacement = replaceWindowOpen(window.open, cb);

    // Removes the replacement after 100 ms to prevent further invocations
    window.setTimeout(windowOpenReplacement.stop, 100);

    return true;
  };

  root.addEventListener('click', clickHandler);
};

export default linkCatcher;

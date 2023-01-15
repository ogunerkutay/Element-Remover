const DEL_SELECTOR = '.header-nav-item, #topchapter, #wrapper_header';

const mo = new MutationObserver(onMutation);
// in case the content script was injected after the page is partially loaded
onMutation([{addedNodes: [document.documentElement]}]);
observe();

function onMutation(mutations) {
  let stopped;
  for (const {addedNodes} of mutations) {
    for (const n of addedNodes) {
      if (n.tagName) {
        if (n.matches(DEL_SELECTOR)) {
          stopped = true;
          mo.disconnect();
          n.remove();
        } else if (n.firstElementChild && n.querySelector(DEL_SELECTOR)) {
          stopped = true;
          mo.disconnect();
          for (const el of n.querySelectorAll(DEL_SELECTOR)) el.remove();
        }
      }
    }
  }
  if (stopped) observe();
}

function observe() {
  mo.observe(document, {
    subtree: true,
    childList: true,
  });
}

/* Notes:

The observer callback must be simple and fast in order not to introduce lags during page loading so use simple selectors and direct DOM access instead of jQuery.
When the job is done it's best to disconnect the observer immediately so that the rest of the page isn't needlessly observed.
Don't add multiple observers, incorporate all checks in just one
mutations array also contains text subnodes along with the added elements themselves. That's why we make sure tagName is present - it means the node is an element.
Each mutation's addedNodes array usually has container elements like DIV, for example, which in turn may have an element we want to delete inside. So we have to examine it with querySelector or querySelectorAll.
childNode.remove() works since Chrome 23 */
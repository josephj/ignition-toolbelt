import { NPE_EXIT } from '../../lib/features';
import { registerObserver } from './utils';

const URI_REGEXP = /\/proposal-editor\/prop_[^\/]+\/.+/;

export const setNpeExit = (value = null) => {
  setTimeout(async () => {
    const isMatchUrl = window.location.href.match(URI_REGEXP);
    const result = await chrome.storage.local.get([NPE_EXIT]);
    const isEnabled = value ? value : result[NPE_EXIT] || false;
    const proposalHeaderEl = document.querySelector(
      '[data-testid="proposal-header"]'
    );

    if (!isMatchUrl || !proposalHeaderEl) {
      return;
    }

    let closeButtonEl = document.getElementById('npe-exit-button');
    if (isEnabled && !closeButtonEl) {
      const closeButtonEl = document.createElement('a');
      closeButtonEl.id = 'npe-exit-button';
      closeButtonEl.href = '/dashboard';
      closeButtonEl.innerHTML = '⨯';
      closeButtonEl.title = 'Close the NPE';
      closeButtonEl.className = 'npe-exit-button';
      if (proposalHeaderEl.firstChild) {
        (proposalHeaderEl.firstChild as HTMLElement).prepend(closeButtonEl);
      }
    } else {
      if (closeButtonEl) {
        closeButtonEl.parentNode?.removeChild(closeButtonEl);
      }
    }
  }, 3000);
};

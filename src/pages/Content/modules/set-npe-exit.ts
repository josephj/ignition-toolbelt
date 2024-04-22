import { NPE_EXIT, q, waitForElement } from '../lib';

const run = async (value = null) => {
  const result = await chrome.storage.local.get([NPE_EXIT]);
  const isEnabled = value ? value : result[NPE_EXIT] || false;
  const proposalHeaderEl = await waitForElement<HTMLDivElement>(
    '[data-testid="proposal-header"]'
  );

  if (!proposalHeaderEl) {
    return;
  }

  let closeButtonEl = q<HTMLLinkElement>('#npe-exit-button');
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
};

export const setNpeExit = () => {
  chrome.runtime.onMessage.addListener(async ({ type }) => {
    if (type === NPE_EXIT) {
      await run();
    }
  });

  chrome.storage.local.onChanged.addListener(async (changes) => {
    const featureFlags = Object.keys(changes);
    if (featureFlags.includes(NPE_EXIT)) {
      await run(changes[NPE_EXIT].newValue);
    }
  });
};

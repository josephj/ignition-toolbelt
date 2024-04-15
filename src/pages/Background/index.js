import './set-current-tab-credentials';
import './set-github-ticket-autolink';
import './set-ignition-credentials';
import './set-jira-mission-control-login';
import './set-mission-control-credentials';
import './set-payment-setup-autofill';
import './set-signup-autofill';
import './set-stripe-connect-autofill';
import './set-subscription-autofill';

import { getActiveTabUrl, getHostUrl } from '../Popup/utils';

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const { type, value } = request;

  if (type === 'ACCESS_TOKEN' && value) {
    chrome.storage.local.set({ accessToken: value });
  }

  if (type === 'GET_CSRF_TOKEN' && value) {
    const activeTabUrl = await getActiveTabUrl();
    const cookie = await chrome.cookies.get({
      url: getHostUrl(activeTabUrl),
      name: 'csrf_token',
    });
    if (cookie) {
      sendResponse(cookie.value);
      chrome.storage.local.set({ csrfToken: cookie.value });
    }
  }
});

(async () => {
  const { fakerSeedValue } = await chrome.storage.local.get('fakerSeedValue');
  if (!fakerSeedValue) {
    chrome.storage.local.set({ fakerSeedValue: new Date().getTime() });
  }
})();

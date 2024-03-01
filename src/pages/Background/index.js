import './set-ignition-credentials';
import './set-mission-control-credentials';
import './set-jira-mission-control-login';

import { getActiveTabUrl, getHostUrl } from '../Popup/utils';

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const { type, value } = request;
  console.log('[DEBUG] Background onMessage', type, value);

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

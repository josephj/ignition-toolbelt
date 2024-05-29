import { JIRA_MISSION_CONTROL_LOGIN } from '../Content/lib';
import { makeIgnitionRequest } from '../../lib/graphql';

const PRODUCTION_URL = 'https://go.ignitionapp.com/';

const FILTERS = {
  url: [
    {
      hostEquals: 'ignitionapp.atlassian.net',
      pathContains: '/browse/',
    },
    {
      hostEquals: 'ignitionapp.atlassian.net',
      pathContains: '/jira/servicedesk',
    },
  ],
};

const setIgnitionCredentials = async () => {
  const csrfTokenCookie = await chrome.cookies.get({
    url: PRODUCTION_URL,
    name: 'csrf_token',
  });
  const sessionIdCookie = await chrome.cookies.get({
    url: PRODUCTION_URL,
    name: '_session_id',
  });
  const csrfToken = csrfTokenCookie?.value;
  const sessionId = sessionIdCookie?.value;
  if (!csrfToken || !sessionId) {
    throw new Error('Missing CSRF token or session ID');
  }

  const cookie = `_session_id=${sessionIdCookie?.value};`;
  try {
    const data = await makeIgnitionRequest({
      cookie,
      csrfToken,
    });
    if (!data.codeVersion) {
      throw new Error('Failed to fetch code version');
    }
  } catch (error) {
    console.error('Failed to set Ignition credentials', error);
    return;
  }

  const ignitionCredential = {
    csrfToken,
    sessionId,
  };

  await chrome.storage.local.set({
    'credential::ignition-production': { cookie, csrfToken },
  });

  await chrome.storage.local.set({ ignitionCredential });

  return ignitionCredential;
};

const handleLoadPage = ({ tabId, url }: { tabId: number; url: string }) => {
  chrome.tabs.sendMessage(tabId, {
    type: JIRA_MISSION_CONTROL_LOGIN,
    value: url,
  });
};

const setEventListeners = (isEnabled: boolean) => {
  if (isEnabled) {
    chrome.webNavigation.onHistoryStateUpdated.addListener(
      handleLoadPage,
      FILTERS
    );
    chrome.webNavigation.onCompleted.addListener(handleLoadPage, FILTERS);
  } else {
    chrome.webNavigation.onHistoryStateUpdated.removeListener(handleLoadPage);
    chrome.webNavigation.onCompleted.removeListener(handleLoadPage);
  }
};

(async () => {
  const result = await chrome.storage.local.get([JIRA_MISSION_CONTROL_LOGIN]);
  const isEnabled = result[JIRA_MISSION_CONTROL_LOGIN];
  if (isEnabled) {
    await setIgnitionCredentials();
    setEventListeners(isEnabled);
  }

  chrome.storage.local.onChanged.addListener(async (changes) => {
    const isMatched = Object.keys(changes).includes(JIRA_MISSION_CONTROL_LOGIN);
    if (isMatched) {
      const isEnabled = changes[JIRA_MISSION_CONTROL_LOGIN].newValue;
      if (isEnabled) {
        await setIgnitionCredentials();
      }
      setEventListeners(isEnabled);
    }
  });
})();

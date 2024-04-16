import { JIRA_MISSION_CONTROL_LOGIN } from '../../lib/features';

(async () => {
  const filters = {
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

  const handleLoadPage = async ({
    tabId,
    url,
  }: {
    tabId: number;
    url: string;
  }) => {
    const results = await chrome.storage.local.get([
      JIRA_MISSION_CONTROL_LOGIN,
    ]);
    const jiraMissionControlLogin = results[JIRA_MISSION_CONTROL_LOGIN];
    if (!jiraMissionControlLogin) {
      return;
    }

    chrome.tabs.sendMessage(tabId, {
      type: 'set-jira-mission-control-login',
      value: url,
    });
  };

  chrome.webNavigation.onHistoryStateUpdated.addListener(
    handleLoadPage,
    filters
  );

  chrome.webNavigation.onCompleted.addListener(handleLoadPage, filters);
})();

import { JIRA_MISSION_CONTROL_LOGIN } from '../Content/lib';

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

  const handleLoadPage = ({ tabId, url }: { tabId: number; url: string }) => {
    chrome.tabs.sendMessage(tabId, {
      type: JIRA_MISSION_CONTROL_LOGIN,
      value: url,
    });
  };

  chrome.webNavigation.onHistoryStateUpdated.addListener(
    handleLoadPage,
    filters
  );

  chrome.webNavigation.onCompleted.addListener(handleLoadPage, filters);
})();

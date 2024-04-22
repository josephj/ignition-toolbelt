import { NPE_EXIT } from '../Content/lib';

(() => {
  const filters = {
    url: [
      {
        hostSuffix: 'ignitionapp.com',
        pathContains: 'proposal-editor/prop_',
      },
      {
        hostContains: 'localhost',
        pathContains: 'proposal-editor/prop_',
      },
    ],
  };

  const handleLoadPage = ({ tabId, url }: { tabId: number; url: string }) => {
    chrome.tabs.sendMessage(tabId, {
      type: NPE_EXIT,
      value: url,
    });
  };

  chrome.webNavigation.onHistoryStateUpdated.addListener(
    handleLoadPage,
    filters
  );

  chrome.webNavigation.onCompleted.addListener(handleLoadPage, filters);
})();

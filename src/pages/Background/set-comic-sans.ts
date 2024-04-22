import { COMIC_SANS } from '../Content/lib';

(() => {
  const filters = {
    url: [
      {
        hostContains: 'ignitionapp.com',
      },
      {
        hostContains: 'localhost',
      },
    ],
  };

  const handleLoadPage = ({ tabId, url }: { tabId: number; url: string }) => {
    chrome.tabs.sendMessage(tabId, {
      type: COMIC_SANS,
      value: url,
    });
  };

  chrome.webNavigation.onHistoryStateUpdated.addListener(
    handleLoadPage,
    filters
  );

  chrome.webNavigation.onCompleted.addListener(handleLoadPage, filters);
})();

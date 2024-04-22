import { AUTOFILL_PAGES } from '../Content/lib';

(() => {
  const filters = {
    url: [
      {
        hostContains: 'ignitionapp.com',
        pathContains: '/settings/payments',
      },
      { hostContains: 'localhost', pathContains: '/settings/payments' },
    ],
  };

  const handleLoadPage = ({ tabId, url }: { tabId: number; url: string }) => {
    chrome.tabs.sendMessage(tabId, {
      type: AUTOFILL_PAGES,
      value: url,
      group: 'payment',
    });
  };

  chrome.webNavigation.onHistoryStateUpdated.addListener(
    handleLoadPage,
    filters
  );

  chrome.webNavigation.onCompleted.addListener(handleLoadPage, filters);
})();

import { AUTOFILL_PAGES } from '../Content/lib';

(() => {
  const filters = {
    url: [
      {
        hostEquals: 'connect-js.stripe.com',
        pathContains: 'ui_layer_',
      },
    ],
  };

  const handleLoadPage = ({ tabId }: { tabId: number; url: string }) => {
    chrome.tabs.sendMessage(tabId, {
      type: AUTOFILL_PAGES,
      value: 'main',
      group: 'stripe',
    });
  };

  chrome.webNavigation.onHistoryStateUpdated.addListener(
    handleLoadPage,
    filters
  );

  chrome.webNavigation.onCompleted.addListener(handleLoadPage, filters);
})();

(() => {
  const filters = {
    url: [
      {
        hostEquals: 'connect-js.stripe.com',
        pathContains: 'accessory_layer_',
      },
    ],
  };

  const handleLoadPage = ({ tabId }: { tabId: number; url: string }) => {
    chrome.tabs.sendMessage(tabId, {
      type: AUTOFILL_PAGES,
      value: 'accessory',
      group: 'stripe',
    });
  };

  chrome.webNavigation.onHistoryStateUpdated.addListener(
    handleLoadPage,
    filters
  );

  chrome.webNavigation.onCompleted.addListener(handleLoadPage, filters);
})();

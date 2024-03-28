(() => {
  const filters = {
    url: [
      {
        hostEquals: 'connect-js.stripe.com',
        pathContains: 'ui_layer_',
      },
    ],
  };

  const handleLoadPage = ({ tabId, url }: { tabId: number; url: string }) => {
    chrome.tabs.sendMessage(tabId, {
      type: 'set-stripe-connect-autofill',
      value: 'main',
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
      type: 'set-stripe-connect-autofill',
      value: 'accessory',
    });
  };

  chrome.webNavigation.onHistoryStateUpdated.addListener(
    handleLoadPage,
    filters
  );

  chrome.webNavigation.onCompleted.addListener(handleLoadPage, filters);
})();

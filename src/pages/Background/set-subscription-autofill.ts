(() => {
  const filters = {
    url: [
      {
        hostContains: 'ignitionapp.com',
        pathContains: '/account/subscription',
      },
      { hostContains: 'localhost', pathContains: '/account/subscription' },
      { hostEquals: 'api.recurly.com', pathContains: '/js/v1/field.html' },
    ],
  };

  const handleLoadPage = ({ tabId, url }: { tabId: number; url: string }) => {
    chrome.tabs.sendMessage(tabId, {
      type: 'set-subscription-autofill',
      value: url,
    });
  };

  chrome.webNavigation.onHistoryStateUpdated.addListener(
    handleLoadPage,
    filters
  );

  chrome.webNavigation.onCompleted.addListener(handleLoadPage, filters);
})();

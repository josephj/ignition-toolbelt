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
      type: 'set-payment-setup-autofill',
      value: url,
    });
  };

  chrome.webNavigation.onHistoryStateUpdated.addListener(
    handleLoadPage,
    filters
  );

  chrome.webNavigation.onCompleted.addListener(handleLoadPage, filters);
})();

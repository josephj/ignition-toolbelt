(() => {
  const filters = {
    url: [
      {
        hostContains: 'ignitionapp.com',
        pathContains: '/sign-up',
      },
      {
        hostContains: 'ignitionapp.com',
        pathContains: '/welcome',
      },
      {
        hostContains: 'localhost',
        pathContains: '/sign-up',
      },
      {
        hostContains: 'localhost',
        pathContains: '/welcome',
      },
    ],
  };

  const handleLoadPage = ({ tabId, url }: { tabId: number; url: string }) => {
    chrome.tabs.sendMessage(tabId, {
      type: 'set-signup-autofill',
      value: url,
    });
  };

  chrome.webNavigation.onHistoryStateUpdated.addListener(
    handleLoadPage,
    filters
  );
  chrome.webNavigation.onCompleted.addListener(handleLoadPage, filters);
})();

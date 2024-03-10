(() => {
  const filters = {
    url: [
      {
        urlMatches:
          'https://github\\.com/ignitionapp/Practice-Ignition/pull/[0-9]+',
      },
    ],
  };

  const handleLoadPage = ({ tabId, url }: { tabId: number; url: string }) => {
    chrome.tabs.sendMessage(tabId, {
      type: 'set-github-ticket-autolink',
      value: url,
    });
  };

  chrome.webNavigation.onHistoryStateUpdated.addListener(
    handleLoadPage,
    filters
  );

  chrome.webNavigation.onCompleted.addListener(handleLoadPage, filters);
})();

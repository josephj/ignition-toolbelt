chrome.runtime.onMessage.addListener((request) => {
  const { type, value } = request;
  if (type === 'ACCESS_TOKEN' && value) {
    chrome.storage.local.set({ accessToken: value });
  }
});

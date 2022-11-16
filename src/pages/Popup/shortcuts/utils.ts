export const openTab = async (url: string, isCreateTab: boolean) => {
  if (isCreateTab) {
    await chrome.tabs.create({ url, active: true });
  } else {
    await chrome.tabs.update({ url });
  }
};

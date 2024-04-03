import Tab = chrome.tabs.Tab;

const AVAILABLE_HOSTS = [
  'localhost:3000',
  'sandbox.ignitionapp.com',
  'demo.ignitionapp.com',
  'go.ignitionapp.com',
];

const checkAvailability = (url?: string) => {
  if (!url) return false;
  return AVAILABLE_HOSTS.some((host) => url.includes(host));
};

const getCookieUrlFromTab = (tab: Tab) => {
  if (!tab?.url) return;

  const urlScheme = new URL(tab?.url);
  return `${urlScheme.protocol}//${urlScheme.host}`;
};

const getCsrfToken = async (
  cookieUrl: string,
  cookieName: string = 'csrf_token'
) => {
  try {
    const cookie = await chrome.cookies.get({
      url: cookieUrl,
      name: cookieName,
    });

    if (cookie) {
      return cookie.value;
    } else {
      throw new Error(`Cookie ${cookieName} not found or permission missing`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Error retrieving ${cookieName} cookie: ${error.message}`
      );
    }
  }
};

const run = async (tab: Tab) => {
  const url = getCookieUrlFromTab(tab);
  const isAvailable = checkAvailability(url);
  const tabId = tab.id;

  if (!url || !isAvailable || !tabId) return;

  try {
    const csrfToken = await getCsrfToken(url);
    console.log(
      `[DEBUG] The \`csrf_token\` cookie in tab #${tabId} is fetched successfully`,
      csrfToken
    );
    chrome.tabs.sendMessage(tabId, {
      type: 'set-current-tab-credentials',
      value: csrfToken,
    });
  } catch (e) {
    if (e instanceof Error) {
      console.error('[DEBUG]', e.message);
    }
  }
};

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  await run(tab);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    await run(tab);
  }
});

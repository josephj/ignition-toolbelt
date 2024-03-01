import { makeIgnitionRequest } from '../../lib/graphql';

const setIgnitionCredentials = async () => {
  // Get CSRF token and session ID from cookies
  const csrfTokenCookie = await chrome.cookies.get({
    url: 'https://go.ignitionapp.com/',
    name: 'csrf_token',
  });
  const sessionIdCookie = await chrome.cookies.get({
    url: 'https://go.ignitionapp.com/',
    name: '_session_id',
  });
  const csrfToken = csrfTokenCookie?.value;
  const sessionId = sessionIdCookie?.value;
  if (!csrfToken || !sessionId) {
    throw new Error('Missing CSRF token or session ID');
  }

  const cookie = `_session_id=${sessionIdCookie?.value};`;
  try {
    const data = await makeIgnitionRequest({
      cookie,
      csrfToken,
    });
    if (!data.codeVersion) {
      throw new Error('Failed to fetch code version');
    }
  } catch (error) {
    console.error('Failed to set Ignition credentials', error);
    return;
  }

  const ignitionCredential = {
    csrfToken,
    sessionId,
  };

  await chrome.storage.local.set({
    'credential::ignition-production': { cookie, csrfToken },
  });

  await chrome.storage.local.set({ ignitionCredential });

  return ignitionCredential;
};

chrome.cookies.onChanged.addListener(async (changeInfo) => {
  if (['csrf_token', '_session_id'].includes(changeInfo.cookie.name)) {
    await setIgnitionCredentials();
  }
});

setIgnitionCredentials().then((value) =>
  console.log('Ignition credentials set!', value)
);

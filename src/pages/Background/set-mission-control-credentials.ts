import { makeMissionControlRequest } from '../../lib/graphql';

const setMissionControlCredentials = async () => {
  // Get CSRF token and session ID from cookies
  const csrfTokenCookie = await chrome.cookies.get({
    url: 'https://go.ignitionapp.com/console',
    name: 'csrf_token',
  });
  const sessionIdCookie = await chrome.cookies.get({
    url: 'https://go.ignitionapp.com/console',
    name: '_session_id',
  });
  const csrfToken = csrfTokenCookie?.value;
  const sessionId = sessionIdCookie?.value;
  if (!csrfToken || !sessionId) {
    throw new Error('Missing CSRF token or session ID');
  }

  const cookie = `_session_id=${sessionIdCookie?.value};`;
  try {
    const data = await makeMissionControlRequest({ cookie, csrfToken });
    if (!data.codeVersion) {
      throw new Error('Failed to fetch code version');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to set mission control credentials', error.message);
    }
    return;
  }

  const missionControlCredential = {
    csrfToken,
    sessionId,
  };

  await chrome.storage.local.set({
    'credential::mission-control-production': { cookie, csrfToken },
  });

  await chrome.storage.local.set({ missionControlCredential });

  return missionControlCredential;
};

chrome.cookies.onChanged.addListener(async (changeInfo) => {
  if (['csrf_token', '_session_id'].includes(changeInfo.cookie.name)) {
    await setMissionControlCredentials();
  }
});

setMissionControlCredentials().then((value) =>
  console.log('Mission control credentials set!', value)
);

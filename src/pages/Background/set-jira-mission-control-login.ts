const proxyUrl =
  'https://australia-southeast1-ignition-restful-proxy.cloudfunctions.net/remove-origin-proxy';

(async () => {
  // src/pages/Background/set-mission-control-credentials.ts
  const { missionControlCredential } = await chrome.storage.local.get([
    'missionControlCredential',
  ]);
  const { csrfToken, sessionId } = missionControlCredential;
  const cookie = `_session_id=${sessionId};`;
  const response = await fetch(
    `${proxyUrl}?cookieValue=${encodeURIComponent(cookie)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Csrf-Token': csrfToken,
      },
      body: JSON.stringify({
        query: `query { codeVersion }`,
      }),
    }
  );
  const data = await response.json();
  if (data.codeVersion) {
    await chrome.storage.local.set({
      'credential::mission-control-production': { cookie, csrfToken },
    });
  }
})();

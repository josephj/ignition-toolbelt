const PROXY_URL =
  'https://australia-southeast1-ignition-restful-proxy.cloudfunctions.net/remove-origin-proxy';

type MakeRequestOptions = {
  query?: string;
  variables?: Record<string, unknown>;
  url?: string;
  cookie?: string;
  csrfToken?: string;
};

const DEFAULT_QUERY = `query { codeVersion }`;
const DEFAULT_VARIABLES = {};
const DEFAULT_URL = 'https://go.ignitionapp.com/graphql';
const DEFAULT_COOKIE = '';
const DEFAULT_CSRF_TOKEN = '';

export const makeRequest = async ({
  query = DEFAULT_QUERY,
  variables = DEFAULT_VARIABLES,
  url = DEFAULT_URL,
  cookie = DEFAULT_COOKIE,
  csrfToken = DEFAULT_CSRF_TOKEN,
}: MakeRequestOptions) => {
  try {
    const requestUrl = `${PROXY_URL}?cookieValue=${encodeURIComponent(
      cookie
    )}&url=${encodeURIComponent(url)}`;
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Csrf-Token': csrfToken,
      },
      body: JSON.stringify({
        query: query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }

    const { data, errors } = await response.json();
    if (errors && errors.length > 0) {
      throw new Error(
        'GraphQL error: ' +
          errors
            .map((error: unknown) =>
              error instanceof Error ? error.message : error
            )
            .join('; ')
      );
    }

    return data;
  } catch (error) {
    throw error;
  }
};

type MakeMissionControlRequestOptions = Omit<MakeRequestOptions, 'url'>;

export const makeMissionControlRequest = async (
  request: MakeMissionControlRequestOptions
) => {
  const key = 'credential::mission-control-production';
  const cache = await chrome.storage.local.get([key]);
  const cacheValue = cache[key] || {};
  return makeRequest({
    url: 'https://go.ignitionapp.com/console/graphql',
    cookie: cacheValue.cookie,
    csrfToken: cacheValue.csrfToken,
    ...request,
  });
};

export const makeIgnitionRequest = async (
  request: MakeMissionControlRequestOptions
) => {
  const key = 'credential::ignition-production';
  const cache = await chrome.storage.local.get([key]);
  const cacheValue = cache[key] || {};
  return makeRequest({
    url: 'https://go.ignitionapp.com/graphql',
    cookie: cacheValue.cookie,
    csrfToken: cacheValue.csrfToken,
    ...request,
  });
};

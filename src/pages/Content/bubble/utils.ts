import { practiceQuerySdk } from '@generated/console/requests';

import { GraphQLClient } from 'graphql-request';

export const countryCodeToFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const createConsoleGraphqlClient = (csrfToken: string) => {
  const urlScheme = new URL(window.location.href);
  const protocol = urlScheme.protocol;
  const host = urlScheme.host;
  const uri = `${protocol}//${host}/console/graphql`;
  return new GraphQLClient(uri, {
    headers: {
      'X-CSRF-Token': csrfToken,
    },
    credentials: 'include',
  });
};
export const fetchConsolePracticeData = async (
  id: string,
  csrfToken: string
) => {
  const consoleClient = createConsoleGraphqlClient(csrfToken);
  const sdk = practiceQuerySdk(consoleClient);
  try {
    return sdk.practice({ id });
  } catch (error) {
    console.error(error);
  }
};

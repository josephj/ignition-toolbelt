import { ApolloClient, InMemoryCache } from '@apollo/client';

export const createApolloClient = ({
  hostUrl,
  accessToken,
}: {
  hostUrl: string;
  accessToken: string;
}) =>
  new ApolloClient({
    uri: `${hostUrl}/graphql`,
    cache: new InMemoryCache(),
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const getHostUrl = (url: string) => {
  if (url.includes('https://demo.ignitionapp.com')) {
    return 'https://demo.ignitionapp.com';
  }

  if (url.includes('https://go.ignitionapp.com')) {
    return 'https://go.ignitionapp.com';
  }

  return 'http://localhost:3000';
};

export const getEnvByUrl = (url: string) => {
  if (url.includes('https://demo.ignitionapp.com')) {
    return 'demo';
  }

  if (url.includes('http://localhost:3000')) {
    return 'local';
  }

  if (url.includes('https://go.ignitionapp.com')) {
    return 'production';
  }

  return null;
};

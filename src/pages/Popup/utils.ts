import { ApolloClient, InMemoryCache } from '@apollo/client';
import { Env } from './types';

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

const AVAILABLE_HOSTS = [
  'localhost:3000',
  'sandbox.ignitionapp.com',
  'demo.ignitionapp.com',
  'go.ignitionapp.com',
];

export const getActiveTabUrl = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0].url;
};

export const checkAvailability = (url: string) =>
  AVAILABLE_HOSTS.some((host) => url.includes(host));

export const getHostUrl = (url?: string) => {
  if (!url) {
    return;
  }
  const urlScheme = new URL(url);
  return `${urlScheme.protocol}//${urlScheme.host}`;
};

export const getUrlByEnv = (env: Env) => {
  switch (env) {
    case 'demo':
      return 'https://demo.ignitionapp.com';
    case 'development':
      return 'http://localhost:3000';
    case 'production':
      return 'https://go.ignitionapp.com';
  }
};

export const getEnvByUrl = (url: string) => {
  if (url.includes('https://demo.ignitionapp.com')) {
    return 'demo';
  }

  if (url.includes('http://localhost:3000')) {
    return 'development';
  }

  if (url.includes('https://go.ignitionapp.com')) {
    return 'production';
  }

  if (url.includes('sandbox.ignitionapp.com')) {
    return 'development';
  }

  return null;
};

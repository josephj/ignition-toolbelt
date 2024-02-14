import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ApolloProvider } from '@apollo/client';

import {
  checkAvailability,
  createApolloClient,
  getActiveTabUrl,
  getHostUrl,
} from './utils';
import { Launch } from './launch';
import { AppStatus } from './app-status';
import { PopupContent } from './popup-content';
import { Login } from './login';

export const Popup = () => {
  const [token, setToken] = useState<string>();
  useEffect(() => {
    chrome.storage.local.get(['accessToken']).then(({ accessToken }) => {
      setToken(accessToken);
    });
  }, []);

  const handleTabUpdated = useCallback((tabId: number) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabId === tabs[0].id) {
        setHostUrl(getHostUrl(tabs[0].url));
      }
    });
  }, []);

  const [hostUrl, setHostUrl] = useState<string>();
  useEffect(() => {
    getActiveTabUrl().then((url) => {
      setHostUrl(getHostUrl(url));
    });
    chrome.tabs.onUpdated.addListener(handleTabUpdated);
    return () => {
      chrome.tabs.onUpdated.removeListener(handleTabUpdated);
    };
  }, [handleTabUpdated]);

  const apolloClient = useMemo(
    () =>
      token && hostUrl
        ? createApolloClient({
            hostUrl,
            accessToken: token,
          })
        : undefined,
    [hostUrl, token]
  );

  const handleSignIn = async (accessToken: string) => {
    await chrome.storage.local.set({ accessToken });
    setToken(accessToken);
  };

  const isIgnition = hostUrl && checkAvailability(hostUrl);
  if (!isIgnition) {
    return <Launch />;
  }

  if (!token) {
    return <Login onSignIn={handleSignIn} />;
  }

  if (!apolloClient) {
    return null;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <PopupContent onSignIn={handleSignIn} />
      <AppStatus />
    </ApolloProvider>
  );
};

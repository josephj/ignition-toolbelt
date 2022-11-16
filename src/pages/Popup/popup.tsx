import React, { useEffect, useMemo, useState } from 'react';
import { ApolloProvider } from '@apollo/client';

import { createApolloClient } from './utils';
import { Launch } from './launch';
import { AppStatus } from './app-status';
import { PopupContent } from './popup-content';
import { Login } from './login';

export const Popup = ({ hostUrl }: { hostUrl: string }) => {
  const [token, setToken] = useState<string>();

  useEffect(() => {
    chrome.storage.local.get(['accessToken']).then(({ accessToken }) => {
      setToken(accessToken);
    });
  }, []);

  const apolloClient = useMemo(
    () =>
      token
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

  if (!hostUrl) {
    return <Launch hostUrl="http://localhost:3000" />;
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

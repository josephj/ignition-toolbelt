import React from 'react';
import { getHostUrl } from '../Popup/utils';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';
import { chakraTheme } from './chakra-theme';
import { RemoveChakraStyle } from './remove-chakra-style';

const hostUrl = getHostUrl(window.location.href);

const createApolloClient = (csrfToken: string) =>
  new ApolloClient({
    uri: `${hostUrl}/graphql`,
    cache: new InMemoryCache(),
    headers: {
      'X-CSRF-Token': csrfToken,
    },
    credentials: 'include',
  });

export const AppWrapper = ({
  csrfToken,
  children,
}: {
  csrfToken: string;
  children: React.ReactNode;
}) => (
  <ApolloProvider client={createApolloClient(csrfToken)}>
    <ChakraProvider theme={chakraTheme}>{children}</ChakraProvider>
    <RemoveChakraStyle />
  </ApolloProvider>
);

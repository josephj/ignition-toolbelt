import React from 'react';
import { getHostUrl } from '../Popup/utils';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';

const hostUrl = getHostUrl(window.location.href);

const apolloClient = new ApolloClient({
  uri: `${hostUrl}/graphql`,
  cache: new InMemoryCache(),
  headers: {
    'X-CSRF-Token': 'csrf',
  },
  credentials: 'include',
});

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider>
    <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
  </ChakraProvider>
);

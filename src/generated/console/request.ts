/* eslint-disable */
/* AUTO-GENERATED FILE. DO NOT EDIT MANUALLY. */
import type { GraphQLClient } from 'graphql-request';
import type * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';

export const PracticeDocument = gql`
  query practice($id: ID!) {
    practice(id: $id) {
      id
      referenceNumber
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType
) => action();

export function practiceQuerySdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper
) {
  return {
    practice(
      variables: PracticeQueryVariables,
      requestHeaders?: Dom.RequestInit['headers']
    ): Promise<PracticeQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<PracticeQuery>(PracticeDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'practice',
        'query'
      );
    },
  };
}

export type Sdk = ReturnType<typeof practiceQuerySdk>;

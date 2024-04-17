import { ApolloClient, InMemoryCache } from '@apollo/client';
import MUTATION_CREATE_BASE_ACCOUNT from '../../../graphql/dev_api/mutation.createPractice.graphql';
import MUTATION_USER_LOGIN from '../../../graphql/auth_api/mutation.userLogin.graphql';

export const authClient = new ApolloClient({
  uri: '/auth-api/graphql',
  cache: new InMemoryCache(),
});

export const devClient = new ApolloClient({
  uri: '/dev_api/graphql',
  cache: new InMemoryCache(),
});

export const createBasePractice = async ({ name = 'Hacker' } = {}) => {
  const { data } = await devClient.mutate({
    mutation: MUTATION_CREATE_BASE_ACCOUNT,
    variables: { name, subscriptionStatus: 'subscribed_professional' },
  });

  const {
    id: practiceId,
    principal: { email },
  } = data.createPractice.practice;

  return { practiceId, email };
};

export const signIn = async ({ email }: { email: string }) => {
  const { data } = await authClient.mutate({
    mutation: MUTATION_USER_LOGIN,
    variables: { email },
  });

  return data?.userLogin;
};

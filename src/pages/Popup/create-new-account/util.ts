import { ApolloClient, gql, InMemoryCache } from '@apollo/client';

export const authClient = new ApolloClient({
  uri: 'http://localhost:3000/auth-api/graphql',
  cache: new InMemoryCache(),
});

export const devClient = new ApolloClient({
  uri: 'http://localhost:3000/dev_api/graphql',
  cache: new InMemoryCache(),
});

const MUTATION_CREATE_BASE_ACCOUNT = gql`
  mutation createPractice($name: String!) {
    createPractice(input: { name: $name }) {
      practice {
        id
        name
        principal {
          email
        }
      }
    }
  }
`;

const MUTATION_USER_LOGIN = gql`
  mutation userLogin($email: EmailAddress!) {
    userLogin(
      input: { email: $email, password: "correct horse battery staple" }
    ) {
      accessToken
      oneTimePasswordRequired
      mfaInfo {
        id
        enabled
        readyForSetup
        setupSkippable
        setupRequiredFrom
        sources {
          deliveryMethod
        }
      }
    }
  }
`;

export const createBasePractice = async ({ name = 'Hacker' } = {}) => {
  const { data } = await devClient.mutate({
    mutation: MUTATION_CREATE_BASE_ACCOUNT,
    variables: { name },
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

  const { accessToken } = data?.userLogin || {};

  window.localStorage.setItem('accessToken', accessToken);
  window.localStorage.setItem('email', email);
  window.localStorage.setItem('password', 'correct horse battery staple');

  return data?.userLogin;
};

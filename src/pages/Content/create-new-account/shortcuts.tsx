import React from 'react';
import { Button, Center, Stack, useBoolean } from '@chakra-ui/react';
import { createBasePractice, devClient, signIn } from './util';
import MUTATION_CREATE_ACCOUNT_WITH_PAYMENTS from '../../../graphql/dev_api/mutation.seedWithPayments.graphql';
import MUTATION_CREATE_STANDARD_ACCOUNT from '../../../graphql/dev_api/mutation.seedStandardPractice.graphql';

export const Shortcuts = () => {
  const [isProcessing, setProcessing] = useBoolean();

  const handleCreateAccountPayment = async () => {
    setProcessing.on();
    const { data } = await devClient.mutate({
      mutation: MUTATION_CREATE_ACCOUNT_WITH_PAYMENTS,
    });
    const { email } = data.seedPracticeWithPayments.practice.principal;
    await signIn({ email });
    window.location.href = '/settings/payments';
    setProcessing.off();
  };

  const makeCreateAccountHandler = ({
    name,
    redirectUrl,
    variables,
  }: {
    name: string;
    redirectUrl?: string;
    variables?: Record<string, any>;
  }) => {
    return async () => {
      setProcessing.on();
      const { practiceId, email } = await createBasePractice({
        name,
      });
      await devClient.mutate({
        mutation: MUTATION_CREATE_STANDARD_ACCOUNT,
        variables: { practiceId, ...variables },
      });
      await signIn({ email });
      window.location.href = redirectUrl || '/';
      setProcessing.off();
    };
  };

  return (
    <Center>
      <Stack>
        <Button
          colorScheme="purple"
          onClick={makeCreateAccountHandler({
            name: 'Standard account',
            redirectUrl: '/dashboard',
          })}
          isLoading={isProcessing}
        >
          Create Standard Account
        </Button>
        <Button
          colorScheme="purple"
          onClick={handleCreateAccountPayment}
          isLoading={isProcessing}
        >
          Account with payments enabled
        </Button>
        <Button
          colorScheme="purple"
          onClick={makeCreateAccountHandler({
            name: 'Account with QuickBooks',
            redirectUrl: '/apps',
            variables: { integrations: ['qbo'] },
          })}
          isLoading={isProcessing}
        >
          Account with QuickBooks
        </Button>
        <Button
          colorScheme="purple"
          onClick={makeCreateAccountHandler({
            name: 'Account with Xero',
            redirectUrl: '/apps',
            variables: { integrations: ['xero'] },
          })}
          isLoading={isProcessing}
        >
          Account with Xero
        </Button>
        <Button
          colorScheme="purple"
          onClick={makeCreateAccountHandler({
            name: 'Account with a draft proposal',
            redirectUrl: '/pipeline?page=1&status=DRAFT',
            variables: { proposalsTraits: ['draft'] },
          })}
          isLoading={isProcessing}
        >
          Account with a draft proposal
        </Button>
      </Stack>
    </Center>
  );
};

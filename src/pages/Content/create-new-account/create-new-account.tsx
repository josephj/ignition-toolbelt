import React from 'react';
import { Button, useBoolean, Stack } from '@chakra-ui/react';
import { devClient, signIn, createBasePractice } from './util';
import MUTATION_CREATE_STANDARD_ACCOUNT from './mutation.seedStandardPractice.graphql';
import MUTATION_CREATE_ACCOUNT_WITH_PAYMENTS from './mutation.seedWithPayments.graphql';

export const CreateNewAccount = () => {
  const [isProcessing, setProcessing] = useBoolean(false);

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

  const handleCreateAccountQuickBooks = async () => {
    setProcessing.on();
    const { practiceId, email } = await createBasePractice({
      name: 'Account with Quickbook',
    });
    await devClient.mutate({
      mutation: MUTATION_CREATE_STANDARD_ACCOUNT,
      variables: { practiceId, integrations: ['qbo'] },
    });
    await signIn({ email });
    window.location.href = '/apps';
    setProcessing.off();
  };

  const handleCreateAccountXero = async () => {
    setProcessing.on();
    const { practiceId, email } = await createBasePractice({
      name: 'Account with Xero',
    });
    await devClient.mutate({
      mutation: MUTATION_CREATE_STANDARD_ACCOUNT,
      variables: { practiceId, integrations: ['xero'] },
    });
    await signIn({ email });
    window.location.href = '/apps';
    setProcessing.off();
  };

  const handleCreateAccountDraftProposal = async () => {
    setProcessing.on();
    const { practiceId, email } = await createBasePractice({
      name: 'Proposal Hacker',
    });
    await devClient.mutate({
      mutation: MUTATION_CREATE_STANDARD_ACCOUNT,
      variables: { practiceId, proposalsTraits: ['draft'] },
    });
    await signIn({ email });
    window.location.href = '/pipeline?page=1&status=DRAFT';
    setProcessing.off();
  };

  const handleCreateAccountStandard = async () => {
    setProcessing.on();
    const { practiceId, email } = await createBasePractice({
      name: 'Standard account',
    });
    await devClient.mutate({
      mutation: MUTATION_CREATE_STANDARD_ACCOUNT,
      variables: { practiceId },
    });
    await signIn({ email });
    window.location.href = '/dashboard';
    setProcessing.off();
  };

  return (
    <Stack>
      <Button
        colorScheme="purple"
        onClick={handleCreateAccountStandard}
        isLoading={isProcessing}
      >
        Create Standard Account
      </Button>
      <Button
        colorScheme="purple"
        onClick={handleCreateAccountPayment}
        isLoading={isProcessing}
      >
        Account With Payments
      </Button>
      <Button
        colorScheme="purple"
        onClick={handleCreateAccountQuickBooks}
        isLoading={isProcessing}
      >
        Account With Qbo Integration
      </Button>
      <Button
        colorScheme="purple"
        onClick={handleCreateAccountXero}
        isLoading={isProcessing}
      >
        Account With Xero Integration
      </Button>
      <Button
        colorScheme="purple"
        onClick={handleCreateAccountDraftProposal}
        isLoading={isProcessing}
      >
        Account With Draft Proposal
      </Button>
    </Stack>
  );
};

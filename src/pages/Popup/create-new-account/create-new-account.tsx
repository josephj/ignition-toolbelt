import React from 'react';
import { Button, Stack, useBoolean } from '@chakra-ui/react';
import { gql } from '@apollo/client';
import { devClient, signIn, createBasePractice } from './util';

const MUTATION_CREATE_STANDARD_ACCOUNT = gql`
  mutation seedStandardPractice($practiceId: ID!) {
    seedStandardPractice(input: { practiceId: $practiceId }) {
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

const MUTATION_CREATE_ACCOUNT_WITH_PAYMENTS = gql`
  mutation seedPracticeWithPayments {
    seedPracticeWithPayments(input: {}) {
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

const MUTATION_CREATE_ACCOUNT_WITH_XERO = gql`
  mutation seedStandardPractice($practiceId: ID!) {
    seedStandardPractice(
      input: { practiceId: $practiceId, integrations: ["xero"] }
    ) {
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

const MUTATION_CREATE_ACCOUNT_WITH_QBO = gql`
  mutation seedStandardPractice($practiceId: ID!) {
    seedStandardPractice(
      input: { practiceId: $practiceId, integrations: ["qbo"] }
    ) {
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

const MUTATION_CREATE_ACCOUNT_WITH_DRAFT_PROPOSAL = gql`
  mutation seedStandardPractice($practiceId: ID!) {
    seedStandardPractice(
      input: { practiceId: $practiceId, proposalsTraits: ["draft"] }
    ) {
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

type Props = {
  onSignIn(token: string): void;
};

export const CreateNewAccount = ({ onSignIn }: Props) => {
  const [isProcessing, setProcessing] = useBoolean(false);

  const handleCreateAccountPayment = async () => {
    setProcessing.on();
    const { data } = await devClient.mutate({
      mutation: MUTATION_CREATE_ACCOUNT_WITH_PAYMENTS,
    });
    const { email } = data.seedPracticeWithPayments.practice.principal;
    const { accessToken } = await signIn({ email });
    onSignIn(accessToken);
    chrome.tabs.update({ url: 'http://localhost:3000/settings/payments' });
    setProcessing.off();
  };

  const handleCreateAccountQuickBooks = async () => {
    setProcessing.on();
    const { practiceId, email } = await createBasePractice({
      name: 'Account with Quickbook',
    });
    await devClient.mutate({
      mutation: MUTATION_CREATE_ACCOUNT_WITH_QBO,
      variables: { practiceId },
    });
    const { accessToken } = await signIn({ email });
    onSignIn(accessToken);
    chrome.tabs.update({ url: 'http://localhost:3000/apps' });
    setProcessing.off();
  };

  const handleCreateAccountXero = async () => {
    setProcessing.on();
    const { practiceId, email } = await createBasePractice({
      name: 'Account with Xero',
    });
    await devClient.mutate({
      mutation: MUTATION_CREATE_ACCOUNT_WITH_XERO,
      variables: { practiceId },
    });
    const { accessToken } = await signIn({ email });
    onSignIn(accessToken);
    chrome.tabs.update({ url: 'http://localhost:3000/apps' });
    setProcessing.off();
  };

  const handleCreateAccountDraftProposal = async () => {
    setProcessing.on();
    const { practiceId, email } = await createBasePractice({
      name: 'Proposal Hacker',
    });
    await devClient.mutate({
      mutation: MUTATION_CREATE_ACCOUNT_WITH_DRAFT_PROPOSAL,
      variables: { practiceId },
    });
    const { accessToken } = await signIn({ email });
    onSignIn(accessToken);
    chrome.tabs.update({
      url: 'http://localhost:3000/pipeline?page=1&status=DRAFT',
    });
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
    const { accessToken } = await signIn({ email });
    onSignIn(accessToken);
    chrome.tabs.update({ url: 'http://localhost:3000/dashboard' });
    setProcessing.off();
  };

  return (
    <Stack>
      <Button
        colorScheme="purple"
        onClick={handleCreateAccountStandard}
        isLoading={isProcessing}
        size="xs"
      >
        Create Standard Account
      </Button>
      <Button
        colorScheme="purple"
        onClick={handleCreateAccountPayment}
        isLoading={isProcessing}
        size="xs"
      >
        Account With Payments
      </Button>
      <Button
        colorScheme="purple"
        onClick={handleCreateAccountQuickBooks}
        isLoading={isProcessing}
        size="xs"
      >
        Account With Qbo Integration
      </Button>
      <Button
        colorScheme="purple"
        onClick={handleCreateAccountXero}
        isLoading={isProcessing}
        size="xs"
      >
        Account With Xero Integration
      </Button>
      <Button
        colorScheme="purple"
        onClick={handleCreateAccountDraftProposal}
        isLoading={isProcessing}
        size="xs"
      >
        Account With Draft Proposal
      </Button>
    </Stack>
  );
};

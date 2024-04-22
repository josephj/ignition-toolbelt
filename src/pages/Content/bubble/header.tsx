import React from 'react';
import { Link, HStack, Stack, Text } from '@chakra-ui/react';
import { useCurrentPracticeQuery } from '@generated/ignition/hooks';
import { countryCodeToFlagEmoji } from './utils';
import { useConsolePractice } from './use-console-practice';

export const Header = ({ csrfToken }: { csrfToken: string }) => {
  const { data } = useCurrentPracticeQuery();
  const { id, name, countryCode, referenceNumber } =
    data?.currentPractice || {};
  const { data: consolePracticeData } = useConsolePractice({ id, csrfToken });

  const { practice: consolePractice } = consolePracticeData || {};
  const { name: planName } = consolePractice?.plan || {};
  const { isDisbursalsEnabled, isCollectionsEnabled } =
    consolePractice?.paymentSettings || {};

  const renderPayment = () => {
    const urlScheme = new URL(window.location.href);
    const consoleUrl = `${urlScheme.origin}/console`;
    if (!consolePracticeData) {
      return (
        <Text fontSize="xsmall">
          Log in to{' '}
          <Link color="blue.500" href={consoleUrl} isExternal>
            Mission Control
          </Link>{' '}
          first
        </Text>
      );
    }

    if (isDisbursalsEnabled && isCollectionsEnabled) {
      return <Text fontSize="xsmall">Payments: On</Text>;
    }

    if (!isDisbursalsEnabled && !isCollectionsEnabled) {
      return <Text fontSize="xsmall">Payments: Off</Text>;
    }

    if (!isDisbursalsEnabled) {
      return <Text fontSize="xsmall">Collection: On / Disbursal: Off</Text>;
    }

    return null;
  };

  return (
    <HStack px="small" spacing="small" alignItems="flex-start">
      <Text
        color="brand"
        fontSize="large"
        fontWeight="medium"
        position="relative"
        top="-3px"
      >
        {countryCode ? countryCodeToFlagEmoji(countryCode) : '🌍'}
      </Text>
      <Stack spacing="xsmall">
        <HStack>
          <Text fontWeight="medium">
            {name} ({referenceNumber})
          </Text>
          {planName ? (
            <Text display="inline" color="gray.500" fontSize="xsmall">
              {planName}
            </Text>
          ) : null}
        </HStack>
        {renderPayment()}
      </Stack>
    </HStack>
  );
};

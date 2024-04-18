import {
  HStack,
  Flex,
  Image,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuButton,
  Stack,
  Text,
} from '@chakra-ui/react';
import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpRightFromSquare,
  faFlag,
  faGear,
  faScrewdriverWrench,
  faWandMagicSparkles,
  faTerminal,
} from '@fortawesome/free-solid-svg-icons';
import { faStripeS } from '@fortawesome/free-brands-svg-icons';
import { GraphQLClient } from 'graphql-request';
import { useCurrentPracticeQuery } from '@generated/ignition/hooks';
import { PracticeQuery, practiceQuerySdk } from '@generated/console/requests';

import { getEnvByUrl } from '../Popup/utils';

const isDevelopmentEnv = getEnvByUrl(window.location.href) === 'development';
const iconUrl = chrome.runtime.getURL('icon-128.png');

const countryCodeToFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const createConsoleGraphqlClient = (csrfToken: string) => {
  const urlScheme = new URL(window.location.href);
  const protocol = urlScheme.protocol;
  const host = urlScheme.host;
  const uri = `${protocol}//${host}/console/graphql`;
  return new GraphQLClient(uri, {
    headers: {
      'X-CSRF-Token': csrfToken,
    },
    credentials: 'include',
  });
};

const fetchConsolePracticeData = async (id: string, csrfToken: string) => {
  const consoleClient = createConsoleGraphqlClient(csrfToken);
  const sdk = practiceQuerySdk(consoleClient);
  try {
    return sdk.practice({ id });
  } catch (error) {
    console.error(error);
  }
};

export const Bubble = ({
  csrfToken,
  onMissionControlClick,
  onPanelClick,
  onAcknowledgementClick,
  onClickCreateNewAccount,
}: {
  csrfToken: string;
  onMissionControlClick(url: string, name: string): void;
  onPanelClick(): void;
  onAcknowledgementClick(): void;
  onClickCreateNewAccount(): void;
}) => {
  const [consolePracticeData, setConsolePracticeData] =
    useState<PracticeQuery['practice']>();
  const { data } = useCurrentPracticeQuery();
  const [position] = useState({ x: 50, y: -100 });
  const dragRef = useRef(null);

  const { id, name, countryCode, referenceNumber } =
    data?.currentPractice || {};

  useEffect(() => {
    if (id) {
      fetchConsolePracticeData(id, csrfToken).then((practiceData) => {
        if (practiceData?.practice) {
          setConsolePracticeData(practiceData.practice);
        }
      });
    }
  }, [id, csrfToken]);

  const handleClickMissionControl = (e: React.MouseEvent) => {
    const url = `${window.location.origin}/console/practice/${id}`;
    if (e.metaKey) {
      window.open(url);
    } else {
      onMissionControlClick(url, 'Mission control');
    }
  };

  const handleClickGraphiql = (e: React.MouseEvent) => {
    const url = `${window.location.origin}/graphiql`;
    if (e.metaKey) {
      window.open(url);
    } else {
      onMissionControlClick(url, 'GraphiQL');
    }
  };

  const { name: planName } = consolePracticeData?.plan || {};
  const { isDisbursalsEnabled, isCollectionsEnabled } =
    consolePracticeData?.paymentSettings || {};
  const stripeDashboardUri =
    consolePracticeData?.stripeIntegrationAccount?.dashboardUri;

  const renderPayment = () => {
    if (!consolePracticeData) {
      return null;
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
    <Draggable position={position} /* onStop={handleStop}*/>
      <Flex
        alignItems="center"
        data-testid="ignition-toolbelt-bubble"
        backgroundColor="gray.200"
        borderRadius="50%"
        boxShadow="0 1px 5px rgba(0, 0, 0, 0.3)"
        display="inline-flex"
        height="50px"
        justifyContent="center"
        opacity="0.5"
        position="fixed"
        ref={dragRef}
        transition="opacity 1s, background-color 1s"
        width="50px"
        zIndex="655350"
        _hover={{
          backgroundColor: 'gray.500',
          opacity: '1',
        }}
      >
        <Menu arrowPadding={16}>
          <MenuButton padding="10px">
            <Image src={iconUrl} width="18px" height="18px" draggable={false} />
          </MenuButton>
          <MenuList>
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
            <MenuDivider />
            <MenuItem
              icon={<FontAwesomeIcon icon={faScrewdriverWrench} />}
              onClick={handleClickMissionControl}
            >
              Mission Control
            </MenuItem>
            <MenuItem
              icon={<FontAwesomeIcon icon={faFlag} />}
              onClick={onAcknowledgementClick}
            >
              Acknowledgements
            </MenuItem>
            <MenuItem
              icon={<FontAwesomeIcon icon={faTerminal} />}
              onClick={handleClickGraphiql}
            >
              GraphiQL
            </MenuItem>
            {stripeDashboardUri ? (
              <MenuItem
                as="a"
                href={stripeDashboardUri}
                target="_blank"
                // @ts-ignore
                icon={<FontAwesomeIcon icon={faStripeS} />}
              >
                <HStack>
                  <Text>Stripe dashboard</Text>
                  <Text as="span" fontSize="xsmall">
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </Text>
                </HStack>
              </MenuItem>
            ) : null}
            {isDevelopmentEnv ? (
              <MenuItem
                icon={<FontAwesomeIcon icon={faWandMagicSparkles} />}
                onClick={onClickCreateNewAccount}
              >
                Create new account
              </MenuItem>
            ) : null}
            <MenuItem
              icon={<FontAwesomeIcon icon={faGear} />}
              onClick={onPanelClick}
            >
              Settings
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Draggable>
  );
};

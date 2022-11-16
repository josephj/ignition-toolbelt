import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
  ChakraProvider,
  HStack,
  Stack,
  Center,
  Flex,
  Textarea,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gql, useQuery } from '@apollo/client';

// @ts-ignore
import logo from '../../assets/img/logo.svg';
import './popup.css';
import {
  faDoorOpen,
  faRocket,
  faSliders,
  faUserSecret,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';
import { AcknowledgementList } from './acknowledgement-list';
import { RefinedIgnition } from './refined-ignition';
import { CreateNewAccount } from './create-new-account';
import { Shortcuts } from './shortcuts';

const QUERY = gql`
  query GetCurrentPractice {
    currentPractice {
      id
      name
    }
  }
`;

export const PopupContent = ({
  onSignIn,
}: {
  onSignIn(accessToken: string): void;
}) => {
  const { data } = useQuery(QUERY);
  const { loading, currentPractice } = data || {};
  const [token, setToken] = useState();

  useEffect(() => {
    chrome.storage.local.get(['accessToken']).then(({ accessToken }) => {
      setToken(accessToken);
    });
  }, [setToken]);

  if (loading) {
    return (
      <Flex alignItems="center" justifyContent="center" className="App">
        <img src={logo} className="App-logo App-logo-spin" alt="logo" />
      </Flex>
    );
  }

  return (
    <ChakraProvider>
      <Stack className="App" spacing="16px" pb="20px">
        <Stack as="header">
          <Center>
            <img src={logo} className="App-logo" alt="logo" />
          </Center>
          <Heading as="h1" size="lg">
            {currentPractice?.name}
          </Heading>
        </Stack>

        <Accordion allowMultiple allowToggle>
          <AccordionItem>
            <AccordionButton>
              <HStack flex="1">
                <FontAwesomeIcon icon={faDoorOpen} />
                <Heading as="h2" size="sm" isTruncated>
                  Shortcuts
                </Heading>
              </HStack>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <Shortcuts />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <HStack flex="1">
                <FontAwesomeIcon icon={faSliders} />
                <Heading as="h2" size="sm" isTruncated>
                  Acknowledgement
                </Heading>
              </HStack>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <AcknowledgementList />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <HStack flex="1">
                <FontAwesomeIcon icon={faWandMagicSparkles} />
                <Heading as="h2" size="sm" isTruncated>
                  Create new account
                </Heading>
              </HStack>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <CreateNewAccount onSignIn={onSignIn} />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <HStack flex="1">
                <FontAwesomeIcon icon={faRocket} />
                <Heading as="h2" size="sm" isTruncated>
                  Refined Ignition
                </Heading>
              </HStack>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <RefinedIgnition />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <HStack flex="1">
                <FontAwesomeIcon icon={faUserSecret} />
                <Heading as="h2" size="sm" isTruncated>
                  Access Token
                </Heading>
              </HStack>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <Textarea fontSize="11px" height="140px" value={token} />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Stack>
    </ChakraProvider>
  );
};

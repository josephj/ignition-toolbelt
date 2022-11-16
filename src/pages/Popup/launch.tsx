import { Stack, Flex, Button, Text } from '@chakra-ui/react';
import { faGem } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

// @ts-ignore
import logo from '../../assets/img/logo.svg';

import './index.css';

export const Launch = ({ hostUrl }: { hostUrl: string }) => {
  const handleRedirect = () => {
    chrome.tabs.update({ url: hostUrl });
  };

  return (
    <Flex
      alignItems="center"
      position="absolute"
      flexDirection="column"
      height="100%"
      justifyContent="center"
      width="100%"
    >
      <Stack spacing="24px" p="50px">
        <img src={logo} className="App-logo" alt="logo" />
        <Stack>
          <Button colorScheme="purple" onClick={handleRedirect} size="lg">
            <FontAwesomeIcon icon={faGem} />{' '}
            <Text fontSize="16px" ml="5px">
              Launch Ignition App
            </Text>
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
};

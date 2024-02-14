import { Stack, Flex, Button } from '@chakra-ui/react';
import React from 'react';
import { Env } from './types';

// @ts-ignore
import logo from '../../assets/img/logo.svg';

import './index.css';
import { getUrlByEnv } from './utils';

export const Launch = () => {
  const handleRedirect = (env: Env) => async () => {
    const url = getUrlByEnv(env);
    await chrome.tabs.update({ url });
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
          <Button
            colorScheme="purple"
            onClick={handleRedirect(Env.DEVELOPMENT)}
          >
            Local
          </Button>
          <Button colorScheme="purple" onClick={handleRedirect(Env.DEMO)}>
            Demo
          </Button>
          <Button colorScheme="purple" onClick={handleRedirect(Env.PRODUCTION)}>
            Production
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
};

import React, { useEffect, useState } from 'react';
import { useCurrentPracticeQuery } from '../../../generated/hooks';
import { Button, HStack } from '@chakra-ui/react';
import { getHostUrl } from '../utils';
import { openTab } from './utils';

export const Shortcuts = () => {
  const { data, loading } = useCurrentPracticeQuery();
  const [hostUrl, setHostUrl] = useState<string>();

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const tabUrl = tabs[0].url || '';
      const baseUrl = getHostUrl(tabUrl);
      setHostUrl(baseUrl);
    });
  }, []);

  if (loading || !data) {
    return null;
  }

  const { currentPractice } = data;

  const handleClickApp = (event: React.MouseEvent) => {
    if (hostUrl) {
      openTab(hostUrl, event.metaKey);
    }
  };

  const handleClickMissionControl = (event: React.MouseEvent) => {
    const url = `${hostUrl}/console/practice/${currentPractice?.id}`;
    if (url) {
      openTab(url, event.metaKey);
    }
  };

  const handleClickGraphiql = (event: React.MouseEvent) => {
    const url = `${hostUrl}/graphiql`;
    if (url) {
      openTab(url, event.metaKey);
    }
  };

  return (
    <HStack>
      <Button onClick={handleClickApp} colorScheme="blue" size="sm">
        App
      </Button>
      <Button onClick={handleClickGraphiql} colorScheme="blue" size="sm">
        GraphiQL
      </Button>
      <Button onClick={handleClickMissionControl} colorScheme="blue" size="sm">
        Mission Control
      </Button>
    </HStack>
  );
};

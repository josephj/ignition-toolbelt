import React, { useEffect, useState } from 'react';
import { useCurrentPracticeQuery } from '../../../generated/hooks';
import { Button, HStack } from '@chakra-ui/react';

export const Shortcuts = () => {
  const { data, loading } = useCurrentPracticeQuery();
  const [hostUrl, setHostUrl] = useState<string | null>();

  useEffect(() => {
    const urlScheme = new URL(window.location.href);
    const url = `${urlScheme.protocol}//${urlScheme.host}`;
    setHostUrl(url);
  }, []);

  if (loading || !data) {
    return null;
  }

  const { currentPractice } = data;

  const handleClickApp = () => {
    if (hostUrl) {
      window.open(hostUrl);
    }
  };

  const handleClickMissionControl = (event: React.MouseEvent) => {
    const url = `${hostUrl}/console/practice/${currentPractice?.id}`;
    if (!url) {
      return;
    }

    if (event.metaKey) {
      window.open(url);
      return;
    }

    window.location.href = url;
  };

  const handleClickGraphiql = (event: React.MouseEvent) => {
    const url = `${hostUrl}/graphiql`;
    if (!url) {
      return;
    }

    if (event.metaKey) {
      window.open(url);
      return;
    }

    window.location.href = url;
  };

  return (
    <HStack>
      <Button onClick={handleClickApp} colorScheme="blue">
        App
      </Button>
      <Button onClick={handleClickGraphiql} colorScheme="blue">
        GraphiQL
      </Button>
      <Button onClick={handleClickMissionControl} colorScheme="blue">
        Mission Control
      </Button>
    </HStack>
  );
};

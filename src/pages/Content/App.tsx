import React from 'react';

import { AppWrapper } from './app-wrapper';
import { Bubble } from './bubble';
import { useBoolean } from '@chakra-ui/react';
import { Panel } from './panel';

export const App = ({ csrfToken }: { csrfToken: string }) => {
  const [isPanelVisible, setPanelVisibility] = useBoolean(false);

  const handleSignIn = () => {
    // do nothing
  };

  return (
    <AppWrapper csrfToken={csrfToken}>
      <Bubble onClick={setPanelVisibility.toggle} />
      {isPanelVisible && (
        <Panel
          isOpen={isPanelVisible}
          onClose={setPanelVisibility.off}
          onSignIn={handleSignIn}
        />
      )}
    </AppWrapper>
  );
};

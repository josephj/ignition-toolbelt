import React from 'react';
import Draggable from 'react-draggable';

import { AppWrapper } from './app-wrapper';
import { Bubble } from './bubble';
import { useBoolean } from '@chakra-ui/react';
import { Panel } from './panel';

export const App = () => {
  const [isPanelVisible, setPanelVisibility] = useBoolean(false);

  return (
    <AppWrapper>
      <Bubble onClick={setPanelVisibility.toggle} />
      {isPanelVisible && (
        <Panel isOpen={isPanelVisible} onClose={setPanelVisibility.off} />
      )}
    </AppWrapper>
  );
};

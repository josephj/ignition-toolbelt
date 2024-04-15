import React, { useState } from 'react';

import { AppWrapper } from './app-wrapper';
import { Bubble } from './bubble';
import { useBoolean } from '@chakra-ui/react';
import { Panel } from './panel';
import { AppStatus } from './app-status/app-status';
import { MissionControl } from './mission-control';
import { AcknowledgementModal } from './acknowledgement-modal';
import { CreateAccountModal } from './create-account-modal';

export const App = ({ csrfToken }: { csrfToken: string }) => {
  const [missionControlUrl, setMissionControlUrl] = useState<string>();
  const [missionControlName, setMissionControlName] = useState<string>();
  const [isAcknowledgementVisible, setAcknowledgementVisibility] = useBoolean();
  const [isPanelVisible, setPanelVisibility] = useBoolean();
  const [isMissionControlVisible, setMissionControlVisibility] = useBoolean();
  const [isCreateAccountVisible, setCreateAccountVisibility] = useBoolean();

  const handleSignIn = () => {
    // do nothing
  };

  return (
    <AppWrapper csrfToken={csrfToken}>
      <Bubble
        onMissionControlClick={(url, name) => {
          setMissionControlName(name);
          setMissionControlUrl(url);
          setMissionControlVisibility.on();
        }}
        onPanelClick={setPanelVisibility.toggle}
        onAcknowledgementClick={setAcknowledgementVisibility.on}
        onClickCreateNewAccount={setCreateAccountVisibility.on}
      />
      <MissionControl
        url={missionControlUrl}
        name={missionControlName}
        isOpen={isMissionControlVisible}
        onClose={setMissionControlVisibility.off}
      />
      <AcknowledgementModal
        isOpen={isAcknowledgementVisible}
        onClose={setAcknowledgementVisibility.off}
      />
      <CreateAccountModal
        isOpen={isCreateAccountVisible}
        onClose={setCreateAccountVisibility.off}
      />
      {isPanelVisible && (
        <Panel isOpen={isPanelVisible} onClose={setPanelVisibility.off} />
      )}
      <AppStatus />
    </AppWrapper>
  );
};

import React, { useEffect, useState } from 'react';
import {
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Textarea,
} from '@chakra-ui/react';

import { AcknowledgementList } from '../Popup/acknowledgement-list';
import { Shortcuts } from '../Popup/shortcuts';
import { RefinedIgnition } from '../Popup/refined-ignition';
import { CreateNewAccount } from '../Popup/create-new-account';

export const Panel = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose(): void;
}) => {
  const [token, setToken] = useState();

  useEffect(() => {
    chrome.storage.local.get(['accessToken']).then(({ accessToken }) => {
      setToken(accessToken);
    });
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ignition Toolbelt</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs>
            <TabList>
              <Tab>Acknowledgements</Tab>
              <Tab>Shortcuts</Tab>
              <Tab>Access Token</Tab>
              <Tab>Refined Ignition</Tab>
              <Tab>Create New Accounts</Tab>
            </TabList>

            <TabPanels p={5}>
              <TabPanel>
                <AcknowledgementList />
              </TabPanel>
              <TabPanel>
                <Center>
                  <Shortcuts />
                  {/*<iframe*/}
                  {/*  width="100%"*/}
                  {/*  height="600px"*/}
                  {/*  src="https://ignitionapp-33185.sandbox.ignitionapp.com/console/practice/prac_myhsvja7fwfqacaahsca"*/}
                  {/*></iframe>*/}
                </Center>
              </TabPanel>
              <TabPanel>
                <Textarea fontSize="11px" height="140px" value={token} />
              </TabPanel>
              <TabPanel>
                <RefinedIgnition />
              </TabPanel>
              <TabPanel>
                <Center>
                  <CreateNewAccount />
                </Center>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

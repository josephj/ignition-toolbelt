import React, { useEffect, useState } from 'react';
import {
  Button,
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
  FormControl,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';

import { RefinedIgnition } from './refined-ignition';
import { faker } from '@faker-js/faker';

export const Panel = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose(): void;
}) => {
  const [, setToken] = useState();
  const [email, setEmail] = useState<string>();

  useEffect(() => {
    chrome.storage.local
      .get(['accessToken', 'fakerSeedValue'])
      .then(({ accessToken, fakerSeedValue }) => {
        setToken(accessToken);
        faker.seed(fakerSeedValue);
        const email = faker.internet.email();
        setEmail(email);
      });
  }, []);

  const handleResetFaker = async () => {
    const fakerSeedValue = new Date().getTime();
    await chrome.storage.local.set({ fakerSeedValue });
    faker.seed(fakerSeedValue);
    const email = faker.internet.email();
    setEmail(email);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs>
            <TabList>
              <Tab>Features</Tab>
              <Tab>Autofill Setting</Tab>
            </TabList>

            <TabPanels p={5}>
              <TabPanel>
                <RefinedIgnition />
              </TabPanel>
              <TabPanel>
                <VStack spacing="large">
                  <FormControl>
                    <FormLabel>Current email</FormLabel>
                    <Input isDisabled value={email} />
                  </FormControl>
                  <Button colorScheme="brand" onClick={handleResetFaker}>
                    Reset
                  </Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

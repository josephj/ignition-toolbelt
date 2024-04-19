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
import { Faker, en_AU, en, base } from '@faker-js/faker';
import { RefinedIgnition } from './refined-ignition';

const faker = new Faker({ locale: [en_AU, en, base] });

export const Panel = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose(): void;
}) => {
  const [, setToken] = useState();
  const [email, setEmail] = useState<string>();
  const [name, setName] = useState<string>();

  useEffect(() => {
    chrome.storage.local
      .get(['accessToken', 'fakerSeedValue'])
      .then(({ accessToken, fakerSeedValue }) => {
        setToken(accessToken);
        faker.seed(fakerSeedValue);
        const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
        const email = faker.internet.email();
        setName(name);
        setEmail(email);
      });
  }, []);

  const handleResetFaker = async () => {
    const fakerSeedValue = new Date().getTime();
    await chrome.storage.local.set({ fakerSeedValue });
    faker.seed(fakerSeedValue);
    const name = faker.person.fullName();
    const email = faker.internet.email();
    setName(name);
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
                  <FormControl>
                    <FormLabel>Current name</FormLabel>
                    <Input isDisabled value={name} />
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

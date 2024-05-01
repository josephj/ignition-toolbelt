import React from 'react';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@chakra-ui/react';
import { CreateStandardPractice } from './create-standard-practice';
import { CreatePaymentPractice } from './create-payment-practice';
import { Shortcuts } from './shortcuts';

export const CreateNewAccount = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>Quick create</Tab>
        <Tab>Create Standard Practice</Tab>
        <Tab>Create Payment Practice</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Shortcuts />
        </TabPanel>
        <TabPanel>
          <CreateStandardPractice />
        </TabPanel>
        <TabPanel>
          <CreatePaymentPractice />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

import {
  Stack,
  FormControl,
  FormLabel,
  StackDivider,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import Select, { SingleValue } from 'react-select';

// @ts-ignore
import logo from '../../../assets/img/logo.svg';

import { FlagOption, FlagSingleValue } from './elements';
import type { SelectOption, SelectOptionGroup } from './types';
import { darkThemeStyles, getOptionGroups } from './utils';
import { AccountInfo } from '../../Content/app-status';

export const Popup = () => {
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const loadAccounts = async () => {
      const result = await chrome.storage.local.get(['accounts']);
      const accounts = result.accounts || {};
      setAccounts(Object.values(accounts));
    };

    loadAccounts();
  }, []);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      if (!tabId) {
        return;
      }
      chrome.tabs.sendMessage(
        tabId,
        { type: 'get-current-practice-id' },
        ({ id }) => {
          setSelectedAccountId(id);
        }
      );
    });
  }, []);

  const handleRedirect = (url: string) => {
    chrome.tabs.update({ url });
    window.close();
  };

  const handleRemoveAccount = async (id: string) => {
    const { accounts } = await chrome.storage.local.get(['accounts']);
    const account = accounts[id];

    if (account) {
      delete accounts[account.id];
      await chrome.storage.local.set({ accounts });
      setAccounts(Object.values(accounts));
    }
  };

  const handleChange = (selectedOption: SingleValue<SelectOption>) => {
    if (selectedOption) {
      handleRedirect(selectedOption.value);
    }
  };

  const options = useMemo(
    () => getOptionGroups(accounts, selectedAccountId),
    [accounts, selectedAccountId]
  );

  return (
    <VStack spacing="xxlarge" py="50px" px="50px" width="100%">
      <img src={logo} alt="logo" style={{ height: '50px' }} />
      <Stack
        spacing="xlarge"
        divider={<StackDivider borderColor="gray.600" />}
        width="100%"
      >
        <FormControl>
          <FormLabel textAlign="center">Log in as the account</FormLabel>
          <Select<SelectOption, false, SelectOptionGroup>
            styles={darkThemeStyles}
            placeholder="Choose an account to log in"
            onChange={handleChange}
            components={{
              Option: (props) => (
                <FlagOption {...props} onRemoveOption={handleRemoveAccount} />
              ),
              SingleValue: FlagSingleValue,
            }}
            options={options}
            value={options
              .flatMap((group) => group.options)
              .find((option) => option.isDisabled)}
          />
        </FormControl>
      </Stack>
    </VStack>
  );
};

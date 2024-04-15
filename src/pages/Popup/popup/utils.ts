import type { StylesConfig } from 'react-select';

import { AccountGroup, SelectOption, SelectOptionGroup } from './types';
import { AccountInfo } from '../../Content/app-status';

export const countryCodeToFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const darkThemeStyles: StylesConfig<
  SelectOption,
  false,
  SelectOptionGroup
> = {
  control: (provided) => ({
    ...provided,
    backgroundColor: '#2D3748',
    color: 'white',
    borderColor: '#4A5568',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'white',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#2D3748',
    color: 'white',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#4A5568' : '#2D3748',
    color: 'white',
    '&:hover': {
      backgroundColor: '#4A5568',
      color: 'white',
    },
  }),
};

export const getOptionGroups = (
  accounts: AccountInfo[],
  selectedAccountId: string | null
) => {
  const accountGroups = accounts.reduce<AccountGroup[]>((acc, account) => {
    const { env } = account;
    const group = acc.find((group) => group.group === env);

    if (group) {
      group.accounts.push(account);
      group.accounts.sort((a, b) => b.lastAccessAt - a.lastAccessAt);
    } else {
      acc.push({ group: env, accounts: [account] });
    }

    return acc;
  }, []);

  return accountGroups.map<SelectOptionGroup>(({ group, accounts }) => ({
    label: group.toUpperCase(),
    options: accounts.map(
      ({ id, countryCode, name, loginUrl, referenceNumber }) => ({
        value: loginUrl,
        label: `${name} (${referenceNumber})`,
        id: id,
        countryCode: countryCode,
        isDisabled: id === selectedAccountId,
      })
    ),
  }));
};

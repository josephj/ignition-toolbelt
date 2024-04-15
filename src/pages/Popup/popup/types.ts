import { AccountInfo } from '../../Content/app-status';

export type SelectOption = {
  id: string;
  countryCode: string;
  value: string;
  label: string;
  isDisabled: boolean;
};

export type AccountGroup = {
  group: string;
  accounts: AccountInfo[];
};

export type SelectOptionGroup = {
  label: string;
  options: SelectOption[];
};

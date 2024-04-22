import { Faker, en_AU, en, base } from '@faker-js/faker';
import {
  AUTOFILL_PAGES,
  q,
  simulateClick,
  simulateType,
  waitForElement,
} from '../../lib';
import 'arrive';
import { getEnvByUrl } from '../../../Popup/utils';

const SUBMIT_BUTTON_SELECTOR = 'button[type="button"]:contains("Submit")';
const BANK_ACCOUNT_NAME_SELECTOR = 'input[placeholder="Account Holder Name"]';
const BANK_ROUTING_NUMBER_SELECTOR = 'input[placeholder="Routing Number"]';
const BANK_BSB_NUMBER_SELECTOR = 'input[placeholder="BSB"]';
const BANK_ACCOUNT_NUMBER_SELECTOR = 'input[placeholder="Account Number"]';

const faker = new Faker({ locale: [en_AU, en, base] });

const run = async (value: string, shouldClickNext = false) => {
  const results = await chrome.storage.local.get([AUTOFILL_PAGES]);
  const isEnabled = results[AUTOFILL_PAGES] || false;
  if (!isEnabled) return;

  const env = getEnvByUrl(value);
  if (env === 'production') return;

  const { fakerSeedValue } = await chrome.storage.local.get(['fakerSeedValue']);
  faker.seed(fakerSeedValue);

  const bankAccountName = await waitForElement<HTMLInputElement>(
    BANK_ACCOUNT_NAME_SELECTOR
  );
  if (bankAccountName)
    simulateType(bankAccountName, faker.finance.accountName());

  const bankRoutingNumber = q<HTMLInputElement>(BANK_ROUTING_NUMBER_SELECTOR);
  if (bankRoutingNumber) simulateType(bankRoutingNumber, '110000000');

  const bankBsbNumber = q<HTMLInputElement>(BANK_BSB_NUMBER_SELECTOR);
  if (bankBsbNumber) simulateType(bankBsbNumber, '000000');

  const bankAccountNumber = q<HTMLInputElement>(BANK_ACCOUNT_NUMBER_SELECTOR);
  if (bankAccountNumber) simulateType(bankAccountNumber, '000123456');

  const submitButton = await waitForElement(SUBMIT_BUTTON_SELECTOR);
  if (shouldClickNext && submitButton) {
    simulateClick(submitButton);
  }
};

export const setPaymentSetupAutofill = () => {
  chrome.runtime.onMessage.addListener(({ type, value, group }) => {
    if (type !== AUTOFILL_PAGES || group !== 'payment') {
      return;
    }

    // @ts-ignore
    document.arrive('.pie-auto-name-on-bank-account', () => run(value));
  });
};

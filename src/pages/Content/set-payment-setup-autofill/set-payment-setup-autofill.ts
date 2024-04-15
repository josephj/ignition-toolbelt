import { faker } from '@faker-js/faker';
import { q, simulateClick, simulateType, waitForElement } from '../lib';
import 'arrive';

const NEXT_BUTTON_SELECTOR = 'button[type="button"]:contains("Next")';
const SUBMIT_BUTTON_SELECTOR = 'button[type="button"]:contains("Submit")';
const BANK_ACCOUNT_NAME_SELECTOR = 'input[placeholder="Account Holder Name"]';
const BANK_ROUTING_NUMBER_SELECTOR = 'input[placeholder="Routing Number"]';
const BANK_BSB_NUMBER_SELECTOR = 'input[placeholder="BSB"]';
const BANK_ACCOUNT_NUMBER_SELECTOR = 'input[placeholder="Account Number"]';

const run = async (shouldClickNext = false) => {
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
  chrome.runtime.onMessage.addListener(({ type }, sender, sendResponse) => {
    if (type !== 'set-payment-setup-autofill') {
      return;
    }

    // @ts-ignore
    document.arrive('.pie-auto-name-on-bank-account', run);
  });
};

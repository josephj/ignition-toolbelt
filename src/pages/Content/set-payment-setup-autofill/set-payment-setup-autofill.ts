import { faker } from '@faker-js/faker';
import { q, simulateClick, simulateType, waitForElement } from '../lib';

const NEXT_BUTTON_SELECTOR = 'button[type="button"]:contains("Next")';
const SUBMIT_BUTTON_SELECTOR = 'button[type="button"]:contains("Submit")';
const BANK_ACCOUNT_NAME_SELECTOR = 'input[placeholder="Account Holder Name"]';
const BANK_ROUTING_NUMBER_SELECTOR = 'input[placeholder="Routing Number"]';
const BANK_BSB_NUMBER_SELECTOR = 'input[placeholder="BSB"]';
const BANK_ACCOUNT_NUMBER_SELECTOR = 'input[placeholder="Account Number"]';

faker.seed(1);

const run = async () => {
  const nextButton = await waitForElement(NEXT_BUTTON_SELECTOR);
  if (nextButton) {
    simulateClick(nextButton);
  }

  const bankAccountName = q<HTMLInputElement>(BANK_ACCOUNT_NAME_SELECTOR);
  if (bankAccountName)
    simulateType(bankAccountName, faker.finance.accountName());

  const bankRoutingNumber = q<HTMLInputElement>(BANK_ROUTING_NUMBER_SELECTOR);
  if (bankRoutingNumber) simulateType(bankRoutingNumber, '110000000');

  const bankBsbNumber = q<HTMLInputElement>(BANK_BSB_NUMBER_SELECTOR);
  if (bankBsbNumber) simulateType(bankBsbNumber, '000000');

  const bankAccountNumber = q<HTMLInputElement>(BANK_ACCOUNT_NUMBER_SELECTOR);
  if (bankAccountNumber) simulateType(bankAccountNumber, '000123456');

  const submitButton = await waitForElement(SUBMIT_BUTTON_SELECTOR);
  if (submitButton) {
    simulateClick(submitButton);
  }
};

export const setPaymentSetupAutofill = () => {
  chrome.runtime.onMessage.addListener(
    ({ type, value }, sender, sendResponse) => {
      if (type === 'set-payment-setup-autofill') {
        setTimeout(() => {
          const isPaymentDisabled =
            !q('[data-testid="ignt-auto-payment-settings"]') &&
            !q('a:contains(Subscribe to a plan)');
          if (isPaymentDisabled) {
            run();
          }
        }, 1000);
      }
    }
  );
};

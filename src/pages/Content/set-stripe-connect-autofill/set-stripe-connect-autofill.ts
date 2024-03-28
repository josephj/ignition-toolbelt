import { Faker, allLocales } from '@faker-js/faker';
import { simulateClick, simulateType, waitForElement } from '../lib';
import { autofillAboutBusinessPage } from './autofill-about-business-page';
import { autofillBusinessDetailsPage } from './autofill-business-details-page';
import { autofillBusinessOwnerPage } from './autofill-business-owner-page';

const faker = new Faker({ locale: 'en_AU', locales: { ...allLocales } });

faker.seed(1);

// https://connect.stripe.com/setup/c/acct_1OyIRoPQQJ1tg5yE/oOzrpeF8X8Jd

const run = async (shouldClickNext = true) => {
  const heading = await waitForElement('h1');
  if (!heading || !heading.textContent) return;

  switch (heading.textContent) {
    case 'About your business':
      await autofillAboutBusinessPage(shouldClickNext);
      return;
    case 'Tell us more about your business':
      await autofillBusinessDetailsPage(faker, shouldClickNext);
      return;
    case 'Verify you represent this business':
      await autofillBusinessOwnerPage(faker, shouldClickNext);
      return;
    default:
      if (heading.textContent.includes('ID verification for ')) {
        const button = await waitForElement(
          'a[data-test="test-mode-fill-button"]'
        );
        if (button) {
          simulateClick(button);
        }
      }

      if (heading.textContent.includes('Review and submit')) {
        const button = await waitForElement(
          'a[data-testid="requirements-index-done-button"]'
        );
        if (button) {
          simulateClick(button);
        }
      }
      return;
  }
};

export const setStripeConnectAutofill = () => {
  chrome.runtime.onMessage.addListener(
    async ({ type, value }, sender, sendResponse) => {
      if (type === 'set-stripe-connect-autofill') {
        if (value === 'main') {
          run();
        } else {
          const searchInput = await waitForElement<HTMLInputElement>(
            '[data-testid="searchable-select-input"]'
          );

          if (searchInput) {
            simulateType(searchInput, 'Accountant');
            const keydownEvent = new KeyboardEvent('keydown', {
              bubbles: true,
              cancelable: true,
              key: 'Enter',
              code: 'Enter',
              keyCode: 13,
            });
            searchInput.dispatchEvent(keydownEvent);
          }
        }
      }
    }
  );
};

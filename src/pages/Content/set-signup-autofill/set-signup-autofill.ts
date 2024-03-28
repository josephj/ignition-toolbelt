import { simulateClick, simulateSelect, simulateType } from './util';
import { faker } from '@faker-js/faker';

faker.seed(1);

const run = (url: string) => {
  const { pathname } = new URL(url);
  switch (pathname) {
    case '/sign-up/sso': {
      const submitButtonEl: HTMLButtonElement | null = document.querySelector(
        '[data-testid="sign-up-email-button"]'
      );
      if (submitButtonEl) {
        simulateClick(submitButtonEl);
      }
      break;
    }
    case '/sign-up/email': {
      const emailEl: HTMLInputElement | null = document.querySelector(
        'input[name="email"]'
      );
      if (emailEl) {
        simulateType(emailEl, faker.internet.email());
      }
      const passwordEl: HTMLInputElement | null = document.querySelector(
        'input[name="password"]'
      );
      if (passwordEl) {
        simulateType(passwordEl, faker.internet.password());
      }
      const submitButtonEl: HTMLButtonElement | null = document.querySelector(
        '[data-testid="submit-button"]'
      );
      if (submitButtonEl) {
        simulateClick(submitButtonEl);
      }
      break;
    }
    case '/welcome': {
      const notSureButton = document.querySelector('button');
      if (notSureButton && notSureButton.innerText === `I'm not sure`) {
        simulateClick(notSureButton);
      }
      break;
    }
    case '/welcome/about': {
      const fullNameEl: HTMLInputElement | null = document.querySelector(
        'input[name="fullName"]'
      );
      if (fullNameEl) simulateType(fullNameEl, faker.person.fullName());

      const companyNameEl: HTMLInputElement | null = document.querySelector(
        'input[name="companyName"]'
      );
      if (companyNameEl) simulateType(companyNameEl, faker.company.name());

      const phoneNumberEl: HTMLInputElement | null = document.querySelector(
        'input[name="phoneNumber"]'
      );
      if (phoneNumberEl) simulateType(phoneNumberEl, faker.phone.number());

      simulateSelect('.countrySelect', 'Australia');

      const referralMethodEl: HTMLInputElement | null = document.querySelector(
        'input[name="referralMethod"]'
      );
      if (referralMethodEl) simulateType(referralMethodEl, 'Google');

      const nextButtonEl: HTMLButtonElement | null = document.querySelector(
        '[data-testid="next-button"]'
      );
      if (nextButtonEl) simulateClick(nextButtonEl);
      break;
    }
    case '/welcome/questions': {
      simulateSelect('.industry', 'Accounting');
      simulateSelect('.revenueBracket', '$0-$200K');
      simulateSelect('.ledger', 'Xero');
      simulateSelect('.clientsCount', '2000+ clients');

      const nextButtonEl: HTMLButtonElement | null = document.querySelector(
        '[data-testid="next-button"]'
      );
      if (nextButtonEl) simulateClick(nextButtonEl);
      break;
    }
  }
};

export const setSignupAutofill = () => {
  chrome.runtime.onMessage.addListener(
    ({ type, value }, sender, sendResponse) => {
      if (type === 'set-signup-autofill') {
        setTimeout(() => {
          run(value);
        }, 1000);
      }
    }
  );
};

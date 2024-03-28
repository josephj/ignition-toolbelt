import { simulateSelect, simulateType } from './util';
import { faker } from '@faker-js/faker';

faker.seed(1);

const run = () => {
  console.log('[DEBUG] run()');

  const firstNameEl: HTMLInputElement | null =
    document.querySelector('[name="firstName"]');
  if (firstNameEl) simulateType(firstNameEl, faker.person.firstName());

  const lastNameEl: HTMLInputElement | null =
    document.querySelector('[name="lastName"]');
  if (lastNameEl) simulateType(lastNameEl, faker.person.lastName());

  const emailEl: HTMLInputElement | null =
    document.querySelector('[name="email"]');
  if (emailEl) simulateType(emailEl, faker.internet.email());

  const phoneEl: HTMLInputElement | null =
    document.querySelector('[name="phone"]');
  if (phoneEl) simulateType(phoneEl, faker.phone.number());

  const addressLineOneEl: HTMLInputElement | null = document.querySelector(
    '[name="addressLineOne"]'
  );
  if (addressLineOneEl)
    simulateType(addressLineOneEl, faker.location.streetAddress());

  const cityEl: HTMLInputElement | null =
    document.querySelector('[name="city"]');
  if (cityEl) simulateType(cityEl, faker.location.city());

  const stateEl: HTMLInputElement | null =
    document.querySelector('[name="state"]');
  if (stateEl) simulateType(stateEl, faker.location.state());

  const postalCodeEl: HTMLInputElement | null = document.querySelector(
    '[name="postalCode"]'
  );
  if (postalCodeEl) simulateType(postalCodeEl, faker.location.zipCode());

  simulateSelect('.chakra-form-control:last-of-type', 'Australia');
};

const runRecurly = () => {
  console.log('[DEBUG] runRecurly()');

  const numberEl: HTMLInputElement | null = document.querySelector(
    '.recurly-hosted-field-input-number'
  );
  if (numberEl) simulateType(numberEl, '4111111111111111');

  const expiryEl: HTMLInputElement | null = document.querySelector(
    '.recurly-hosted-field-input-expiry'
  );
  if (expiryEl) simulateType(expiryEl, '12/30');

  const cvvEl: HTMLInputElement | null = document.querySelector(
    '.recurly-hosted-field-input-cvv'
  );
  if (cvvEl) simulateType(cvvEl, '123');
};

export const setSubscriptionAutofill = () => {
  chrome.runtime.onMessage.addListener(
    ({ type, value }, sender, sendResponse) => {
      if (type === 'set-subscription-autofill') {
        const isRecurly = value.includes('api.recurly.com');
        setTimeout(isRecurly ? runRecurly : run, 2000);
      }
    }
  );
};

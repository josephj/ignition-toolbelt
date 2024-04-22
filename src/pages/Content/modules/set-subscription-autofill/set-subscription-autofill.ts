import { simulateSelect, simulateType } from './util';
import { Faker, en_AU, en, base } from '@faker-js/faker';
import { AUTOFILL_PAGES, waitForElement } from '../../lib';
import { getEnvByUrl } from '../../../Popup/utils';

const faker = new Faker({ locale: [en_AU, en, base] });

const run = async (url: string /*, shouldClickNext = false*/) => {
  const results = await chrome.storage.local.get([AUTOFILL_PAGES]);
  const isEnabled = results[AUTOFILL_PAGES] || false;
  if (!isEnabled) return;

  const env = getEnvByUrl(url);
  if (env === 'production') return;

  const { fakerSeedValue } = await chrome.storage.local.get(['fakerSeedValue']);
  faker.seed(fakerSeedValue);

  const firstNameEl = await waitForElement<HTMLInputElement>(
    '[name="firstName"]'
  );
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

const runRecurly = async () => {
  console.log('[DEBUG] runRecurly()');
  const results = await chrome.storage.local.get([AUTOFILL_PAGES]);
  const isEnabled = results[AUTOFILL_PAGES] || false;
  if (!isEnabled) return;

  const numberEl = await waitForElement<HTMLInputElement>(
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
  chrome.runtime.onMessage.addListener(({ type, value, group }) => {
    if (type === AUTOFILL_PAGES && group === 'subscription') {
      const isRecurly = value.includes('api.recurly.com');
      isRecurly ? runRecurly() : run(value);
    }
  });
};

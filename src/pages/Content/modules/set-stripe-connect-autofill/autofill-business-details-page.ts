import {
  q,
  simulateClick,
  simulateSelect,
  simulateType,
  waitForElement,
} from '../../lib';
import { Faker } from '@faker-js/faker';

function generateFakeABN(faker: Faker) {
  const prefix = faker.datatype.number({ min: 10, max: 99 }).toString();
  const body = faker.datatype
    .number({ min: 100000000, max: 999999999 })
    .toString();
  return `${prefix} ${body}`;
}

export const autofillBusinessDetailsPage = async (
  faker: Faker,
  shouldClickNext: boolean = false
) => {
  const companyName = q<HTMLInputElement>('input[name="company[name]"]');
  if (companyName) {
    simulateType(companyName, faker.company.name());
  }

  const companyTaxId = q<HTMLInputElement>('input[name="company[tax_id]"]');
  if (companyTaxId) {
    simulateType(companyTaxId, generateFakeABN(faker));
  }

  const doingBusinessAs = q<HTMLInputElement>(
    'input[name="business_profile[name]"]'
  );
  if (doingBusinessAs) {
    simulateType(doingBusinessAs, faker.company.name());
  }

  const streetAddress = q<HTMLInputElement>('input[data-testid="address1"]');
  if (streetAddress) {
    simulateType(streetAddress, faker.location.streetAddress());
  }

  const flatUnit = q<HTMLInputElement>('input[data-testid="address2"]');
  if (flatUnit) {
    simulateType(flatUnit, faker.location.secondaryAddress());
  }

  const city = q<HTMLInputElement>('input[data-testid="locality"]');
  if (city) {
    simulateType(city, faker.location.city());
  }

  const state = q('select[data-testid="subregion"]');
  if (state) {
    simulateSelect(
      'select[data-testid="subregion"]',
      faker.location.state({ abbreviated: true })
    );
  }

  const postalCode = q<HTMLInputElement>('input[data-testid="postal-code"]');
  if (postalCode) {
    simulateType(postalCode, faker.location.zipCode());
  }

  const phoneNumber = q<HTMLInputElement>('input[type="tel"]');
  if (phoneNumber) {
    simulateType(phoneNumber, faker.helpers.fromRegExp(/041[0-9]{7}/));
  }

  const businessWebsite = q<HTMLInputElement>(
    'input[name="business_profile[url]"]'
  );
  if (businessWebsite) {
    simulateType(businessWebsite, faker.internet.url());
  }

  const industry = q('a[data-testid="searchable-select-button"]');
  if (industry) {
    simulateClick(industry);
  }

  const el = await waitForElement(
    'a[data-testid="searchable-select-button"]:contains("Accounting")'
  );

  if (el && shouldClickNext) {
    const nextButton = q('a:contains("Continue")');
    if (nextButton) {
      simulateClick(nextButton);
    }
  }
};

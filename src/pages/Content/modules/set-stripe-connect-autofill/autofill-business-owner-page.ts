import type { Faker } from '@faker-js/faker';
import { q, simulateClick, simulateSelect, simulateType } from '../../lib';

export const autofillBusinessOwnerPage = async (
  faker: Faker,
  shouldClickNext: boolean = false
) => {
  const legalFirstName = q<HTMLInputElement>('input[name="first_name"]');
  const legalLastName = q<HTMLInputElement>('input[name="last_name"]');
  if (legalFirstName && legalLastName) {
    simulateType(legalFirstName, faker.person.firstName());
    simulateType(legalLastName, faker.person.lastName());
  }

  const emailAddress = q<HTMLInputElement>('input[name="email"]');
  if (emailAddress) {
    simulateType(emailAddress, faker.internet.email());
  }

  const jobTitle = q<HTMLInputElement>('input[name="relationship[title]"]');
  if (jobTitle) {
    simulateType(jobTitle, faker.person.jobTitle());
  }

  const dayOfBirth = q<HTMLInputElement>('input[placeholder="DD"]');
  const monthOfBirth = q<HTMLInputElement>('input[placeholder="MM"]');
  const yearOfBirth = q<HTMLInputElement>('input[placeholder="YYYY"]');
  if (dayOfBirth && monthOfBirth && yearOfBirth) {
    const dob = faker.date.past({ years: 50, refDate: '2000-1-1' });
    simulateType(dayOfBirth, `0${dob.getDate()}`.slice(-2));
    simulateType(monthOfBirth, `0${dob.getMonth() + 1}`.slice(-2)); // Months are zero-indexed
    simulateType(yearOfBirth, dob.getFullYear().toString());
  }

  const streetAddress = q<HTMLInputElement>('input[data-testid="address1"]');
  const flatUnitOther = q<HTMLInputElement>('input[data-testid="address2"]');
  const city = q<HTMLInputElement>('input[data-testid="locality"]');
  const state = q<HTMLInputElement>('select[data-testid="subregion"]');
  const postalCode = q<HTMLInputElement>('input[data-testid="postal-code"]');
  if (streetAddress && flatUnitOther && city && state && postalCode) {
    simulateType(streetAddress, faker.location.streetAddress());
    simulateType(flatUnitOther, faker.location.secondaryAddress());
    simulateType(city, faker.location.city());
    simulateSelect(
      'select[data-testid="subregion"]',
      faker.location.state({ abbreviated: true })
    );
    simulateType(postalCode, faker.location.zipCode());
  }

  const phoneNumber = q<HTMLInputElement>('input[type="tel"]');
  if (phoneNumber) {
    simulateType(phoneNumber, faker.helpers.fromRegExp(/041[0-9]{7}/));
  }

  if (shouldClickNext) {
    const nextButton = q('a:contains("Continue")');
    if (nextButton) {
      simulateClick(nextButton);
    }
  }
};

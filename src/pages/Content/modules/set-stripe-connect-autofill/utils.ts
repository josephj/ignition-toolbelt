import type { Faker } from '@faker-js/faker';

const states = ['NSW', 'ACT', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT'] as const;

export type State = (typeof states)[number];

type AustralianStatePostcodes = {
  [key in State]: string[];
};

const australianStatePostcodes: AustralianStatePostcodes = {
  NSW: ['2000', '2145', '2250', '2560', '2750'],
  ACT: ['2600', '2602', '2604', '2609', '2913'],
  VIC: ['3000', '3122', '3205', '3550', '3752'],
  QLD: ['4000', '4217', '4551', '4740', '4870'],
  SA: ['5000', '5045', '5112', '5162', '5606'],
  WA: ['6000', '6100', '6210', '6430', '6530'],
  TAS: ['7000', '7010', '7250', '7310', '7470'],
  NT: ['0800', '0810', '0820', '0850', '0870'],
};

export const getPostCodeByState = (faker: Faker, state: State) => {
  return faker.helpers.arrayElement(australianStatePostcodes[state]);
};

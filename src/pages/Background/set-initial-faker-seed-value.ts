import { AUTOFILL_PAGES } from '../Content/lib';

const FAKER_SEED_VALUE = 'fakerSeedValue';

const setInitialFakerSeedValue = async () => {
  const { fakerSeedValue } = await chrome.storage.local.get(FAKER_SEED_VALUE);
  if (!fakerSeedValue) {
    await chrome.storage.local.set({ fakerSeedValue: new Date().getTime() });
  }
};

(async () => {
  const results = await chrome.storage.local.get([AUTOFILL_PAGES]);
  const isEnabled = !!results[AUTOFILL_PAGES];
  if (isEnabled) {
    await setInitialFakerSeedValue();
  }

  chrome.storage.local.onChanged.addListener(async (changes) => {
    const isMatched = Object.keys(changes).includes(AUTOFILL_PAGES);
    if (isMatched) {
      const isEnabled = !!changes[AUTOFILL_PAGES].newValue;
      if (isEnabled) {
        await setInitialFakerSeedValue();
      }
    }
  });
})();

import { COMIC_SANS } from '../lib';

const run = async (value = null) => {
  const result = await chrome.storage.local.get([COMIC_SANS]);
  const isEnabled = value ? value : result[COMIC_SANS] || false;
  if (isEnabled) {
    document.body.style.fontFamily =
      '"Comic Sans MS", "Chalkboard SE", "Comic Neue", sans-serif';
  } else {
    document.body.style.fontSize = '';
    document.body.style.fontFamily = '';
  }
};

export const setComicSans = () => {
  chrome.runtime.onMessage.addListener(async ({ type }) => {
    if (type === COMIC_SANS) {
      await run();
    }
  });

  chrome.storage.local.onChanged.addListener(async (changes) => {
    const featureFlags = Object.keys(changes);
    if (featureFlags.includes(COMIC_SANS)) {
      await run(changes[COMIC_SANS].newValue);
    }
  });
};

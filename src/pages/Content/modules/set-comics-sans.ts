import { COMIC_SANS } from '../../../lib/features';

export const setComicSans = async (value = null) => {
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

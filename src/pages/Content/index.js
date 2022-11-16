import { setCaptureAccessToken } from './set-capture-access-token';
import { setComicSans } from './set-comics-sans';
import { setMissionControlRedirect } from './set-mission-control-redirect';
import { setNpeExit } from './set-npe-exit';
import {
  COMIC_SANS,
  MISSION_CONTROL_REDIRECT,
  NPE_EXIT,
} from '../../lib/features';

window.addEventListener('load', async () => {
  await setCaptureAccessToken();
  await setComicSans();
  await setMissionControlRedirect();
  await setNpeExit();
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const { type, value } = request;
  if (type === COMIC_SANS) await setComicSans(value);
  if (type === NPE_EXIT) await setNpeExit(value);
  if (type === MISSION_CONTROL_REDIRECT) await setMissionControlRedirect(value);
});

/**
 * Using redirect instead of opening a new window in the Mission Control
 */

import { registerObserver } from './utils';
import { MISSION_CONTROL_REDIRECT } from '../../lib/features';
import { q } from './lib';

type FormElement = HTMLFormElement | null | undefined;

const URI_REGEXP = /\/console\/practice\/prac_/;
export const setMissionControlRedirect = (value = null) => {
  registerObserver(async () => {
    const result = await chrome.storage.local.get([MISSION_CONTROL_REDIRECT]);
    const isMatchUrl = window.location.href.match(URI_REGEXP);
    const isEnabled = value ? value : result[MISSION_CONTROL_REDIRECT] || false;
    const formEl = document.querySelector(
      '#support-signin-form'
    ) as FormElement;
    if (isMatchUrl && formEl) {
      if (isEnabled) {
        formEl.method = 'get';
        formEl.target = '_self';
      } else {
        formEl.method = 'post';
        formEl.target = '_blank';
      }
    }

    if (window !== window.parent) {
      q('[form="support-signin-form"]')?.remove();
      q('[placeholder^="Search for a practice"]')?.remove();
    }
  });
};

import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';

import { setCaptureAccessToken } from './set-capture-access-token';
import { setComicSans } from './set-comics-sans';
import { setMissionControlRedirect } from './set-mission-control-redirect';
import { setNpeExit } from './set-npe-exit';
import { setGithubTicketAutolink } from './set-github-ticket-autolink';
import { setJiraMissionControlLogin } from './set-jira-mission-control-login';
import {
  COMIC_SANS,
  MISSION_CONTROL_REDIRECT,
  NPE_EXIT,
} from '../../lib/features';
import { checkAvailability } from '../Popup/utils';
import { setPaymentSetupAutofill } from './set-payment-setup-autofill';
import { setSignupAutofill } from './set-signup-autofill';
import { setStripeConnectAutofill } from './set-stripe-connect-autofill';
import { setSubscriptionAutofill } from './set-subscription-autofill';

window.addEventListener('load', async () => {
  await setCaptureAccessToken();
  await setComicSans();
  await setMissionControlRedirect();
  await setNpeExit();
  await setGithubTicketAutolink();
  await setJiraMissionControlLogin();
  await setSignupAutofill();
  await setSubscriptionAutofill();
  await setPaymentSetupAutofill();
  await setStripeConnectAutofill();
});

const WIDGET_EXCLUDED_PATHS = ['/sign-in', '/sign-up', '/console'];

chrome.storage.local.onChanged.addListener(async (changes) => {
  const keys = Object.keys(changes);
  keys.forEach((key) => {
    const { newValue } = changes[key];
    if (key === COMIC_SANS) setComicSans(newValue);
    if (key === NPE_EXIT) setNpeExit(newValue);
    if (key === MISSION_CONTROL_REDIRECT) setMissionControlRedirect(newValue);
  });
});

chrome.runtime.onMessage.addListener(async ({ type, value }) => {
  if (type === 'set-current-tab-credentials') {
    const url = window.location.href;
    const urlScheme = new URL(url);

    const isWidgetAvailable =
      checkAvailability(url) &&
      !WIDGET_EXCLUDED_PATHS.some((path) => urlScheme.pathname.includes(path));

    if (!isWidgetAvailable) return;

    let rootEl = document.getElementById('ignition-toolbelt-app');
    if (!rootEl) {
      rootEl = document.createElement('div');
      if (document.body) {
        document.body.appendChild(rootEl);
      }
      const root = createRoot(rootEl);
      root.render(<App csrfToken={value} />);
    }
  }
});

import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';

import { setComicSans } from './modules/set-comics-sans';
import { setMissionControlRedirect } from './modules/set-mission-control-redirect';
import { setNpeExit } from './modules/set-npe-exit';
import { setGithubTicketAutolink } from './modules/set-github-ticket-autolink';
import { setJiraMissionControlLogin } from './modules/set-jira-mission-control-login';
import { checkAvailability } from '../Popup/utils';
import { setPaymentSetupAutofill } from './modules/set-payment-setup-autofill';
import { setSignupAutofill } from './modules/set-signup-autofill';
import { setStripeConnectAutofill } from './modules/set-stripe-connect-autofill';
import { setSubscriptionAutofill } from './modules/set-subscription-autofill';

window.addEventListener('load', async () => {
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

const WIDGET_EXCLUDED_PATHS = [
  '/sign-in',
  '/sign-up',
  '/console',
  '/graphiql',
  '/welcome',
  '/client-portal',
];

chrome.runtime.onMessage.addListener(async ({ type, value }) => {
  if (type === 'set-current-tab-credentials') {
    const url = window.location.href;
    const urlScheme = new URL(url);

    const isWidgetAvailable =
      checkAvailability(url) &&
      !WIDGET_EXCLUDED_PATHS.some((path) => urlScheme.pathname.includes(path));

    if (!isWidgetAvailable) return;

    let rootEl = document.getElementById('ignition-toolbelt-app');
    if (rootEl === null) {
      rootEl = document.createElement('div');
      rootEl.id = 'ignition-toolbelt-app';
      if (document.body) {
        document.body.appendChild(rootEl);
        const root = createRoot(rootEl);
        root.render(<App csrfToken={value} />);
      }
    }
  }
});

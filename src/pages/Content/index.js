import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';

import { setCaptureAccessToken } from './set-capture-access-token';
import { setComicSans } from './set-comics-sans';
import { setMissionControlRedirect } from './set-mission-control-redirect';
import { setNpeExit } from './set-npe-exit';
import { setGithubTicketAutolink } from './set-github-ticket-autolink';
import { setJiraMissionControlLogin } from './set-jira-mission-control-login/set-jira-mission-control-login';
import {
  COMIC_SANS,
  MISSION_CONTROL_REDIRECT,
  NPE_EXIT,
} from '../../lib/features';
import { checkAvailability } from '../Popup/utils';

window.addEventListener('load', async () => {
  await setCaptureAccessToken();
  await setComicSans();
  await setMissionControlRedirect();
  await setNpeExit();
  await setGithubTicketAutolink();
  await setJiraMissionControlLogin();
});

chrome.runtime.onMessage.addListener(async (request) => {
  const { type, value } = request;
  if (type === COMIC_SANS) await setComicSans(value);
  if (type === NPE_EXIT) await setNpeExit(value);
  if (type === MISSION_CONTROL_REDIRECT) await setMissionControlRedirect(value);
});

(() => {
  const url = window.location.href;
  const isWidgetAvailable = checkAvailability(url);
  if (!isWidgetAvailable) return;

  let rootEl = document.getElementById('ignition-toolbelt-app');
  if (!rootEl) {
    rootEl = document.createElement('div');
    if (document.body) {
      document.body.appendChild(rootEl);
    }
  }

  const root = createRoot(rootEl);
  root.render(<App />);
})();

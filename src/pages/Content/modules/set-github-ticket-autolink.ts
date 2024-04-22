import { GITHUB_AUTOLINK } from '../lib';

const TICKET_REGEXP = /(\b[A-Z]{1,10}-\d{1,6}\b)(?!([^<]+)?>)(?![\w-])/g;
const SELECTOR = '.js-issue-title, .js-comment-body';
const JIRA_URL = 'https://ignitionapp.atlassian.net/browse/';

const run = async (value = null) => {
  const result = await chrome.storage.local.get([GITHUB_AUTOLINK]);
  const isEnabled = value ? value : result[GITHUB_AUTOLINK] || false;

  if (isEnabled) {
    const matchEls = document.querySelectorAll<HTMLElement>(SELECTOR);
    if (matchEls.length) {
      matchEls.forEach((el) => {
        el.innerHTML = el.innerHTML.replace(
          TICKET_REGEXP,
          (match) =>
            `<a href="${JIRA_URL}${match}" target="_blank" title="${match}" class="jira-link">${match}</a>`
        );
      });
    }
  } else {
    const matchEls = document.querySelectorAll<HTMLLinkElement>('.jira-link');
    matchEls.forEach((el) => {
      el.outerHTML = el.textContent || '';
    });
  }
};

export const setGithubTicketAutolink = async () => {
  chrome.runtime.onMessage.addListener(async ({ type }) => {
    if (type === GITHUB_AUTOLINK) {
      await run();
    }
  });

  chrome.storage.local.onChanged.addListener(async (changes) => {
    const featureFlags = Object.keys(changes);
    if (featureFlags.includes(GITHUB_AUTOLINK)) {
      await run(changes[GITHUB_AUTOLINK].newValue);
    }
  });
};

const TICKET_REGEXP = /(\b[A-Z]{1,10}-\d{1,6}\b)(?!([^<]+)?>)(?![\w-])/g;
const SELECTOR = '.js-issue-title, .js-comment-body';
const JIRA_URL = 'https://ignitionapp.atlassian.net/browse/';

const run = () => {
  const matchEls = document.querySelectorAll<HTMLElement>(SELECTOR);
  if (matchEls.length) {
    matchEls.forEach((el) => {
      el.innerHTML = el.innerHTML.replace(
        TICKET_REGEXP,
        (match) =>
          `<a href="${JIRA_URL}${match}" target="_blank" title="${match}">${match}</a>`
      );
    });
  }
};

export const setGithubTicketAutolink = () => {
  chrome.runtime.onMessage.addListener(({ type }, sender, sendResponse) => {
    if (type === 'set-github-ticket-autolink') run();
  });
};

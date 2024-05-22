import 'arrive';

import {
  GITHUB_AUTOFILL,
  waitForElement,
  q,
  simulateClick,
  simulateType,
  GITHUB_AUTOFILL_SETTING,
} from '../lib';

const REGEXP_PR_URL = /https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/;
const REGEXP_COMPARE_URL =
  /https:\/\/github\.com\/([^/]+)\/([^/]+)\/compare\/([^...]+)...([^:]+):([^?]+)/;

const getApiUrls = (url: string) => {
  const result: Record<string, string> = {};

  const compareUrlParts = url.match(REGEXP_COMPARE_URL);
  if (compareUrlParts) {
    const baseOwner = compareUrlParts[1];
    const baseRepo = compareUrlParts[2];
    const baseBranch = compareUrlParts[3];
    const headOwner = compareUrlParts[4];
    const headBranch = compareUrlParts[5];

    result.compareUrl = `https://api.github.com/repos/${baseOwner}/${baseRepo}/compare/${baseBranch}...${headOwner}:${headBranch}`;
  }

  // NOTE - This is not used at the moment
  const prUrlParts = url.match(REGEXP_PR_URL);
  if (prUrlParts) {
    const baseOwner = prUrlParts[1];
    const baseRepo = prUrlParts[2];
    const prNumber = prUrlParts[3];
    result.diffUrl = `https://api.github.com/repos/${baseOwner}/${baseRepo}/pulls/${prNumber}.diff`;
  }

  return result;
};

const fetchDetails = async (url: string, token: string) => {
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
  };

  const { compareUrl, diffUrl } = getApiUrls(url);
  const result: Record<string, any> = {};
  try {
    if (compareUrl) {
      const compareResponse = await fetch(compareUrl, { headers });
      result.compareData = await compareResponse.json();
    }

    if (diffUrl) {
      const diffResponse = await fetch(diffUrl, {
        headers: {
          ...headers,
          Accept: 'application/vnd.github.v3.diff',
        },
      });

      if (!diffResponse.ok) {
        throw new Error(
          `GitHub API responded with status: ${diffResponse.status}`
        );
      }

      result.diffContent = await diffResponse.text();
    }

    return result;
  } catch (error) {
    console.error('Error fetching details:', error);
    throw error;
  }
};

const run = async (url?: string) => {
  const results = await chrome.storage.local.get([GITHUB_AUTOFILL_SETTING]);
  const { reviewers, labels, token } = results[GITHUB_AUTOFILL_SETTING] || {
    reviewers: [],
    labels: [],
    token: '',
  };

  if (reviewers.length) {
    const reviewerEl = await waitForElement<HTMLDivElement>(
      '[data-menu-trigger="reviewers-select-menu"]'
    );
    if (reviewerEl) {
      simulateClick(reviewerEl);
      const reviewerInput = q<HTMLInputElement>('#review-filter-field');
      if (reviewerInput) {
        for (const reviewer of reviewers) {
          simulateType(reviewerInput, reviewer);
          const el = await waitForElement<HTMLSpanElement>(
            `.js-username:contains("${reviewer}")`
          );
          if (el) {
            simulateClick(el);
            simulateType(reviewerInput, '{selectall}{del}');
          }
        }
        simulateType(reviewerInput, '{esc}');
        simulateClick(reviewerEl);
      }
    }
  }

  if (labels.length) {
    const labelEl = q('[data-menu-trigger="labels-select-menu"]');
    if (labelEl) {
      simulateClick(labelEl);
      const labelInput = q<HTMLInputElement>('#label-filter-field');
      if (labelInput) {
        for (const label of labels) {
          simulateType(labelInput, label);
          const el = await waitForElement<HTMLSpanElement>(
            `.js-label-name-html:contains("${label}")`
          );
          if (el) {
            simulateClick(el);
            simulateType(labelInput, '{selectall}{del}');
          }
        }
        simulateType(labelInput, '{esc}');
        simulateClick(labelEl);
      }
    }
  }

  if (token && url) {
    const { compareData } = await fetchDetails(url, token);
    const { commits } = compareData;
    const lastCommit = commits[commits.length - 1].commit;

    const title = lastCommit.message.split('\n')[0];
    const description = lastCommit.message.split('\n\n')[1];
    const titleEl = q<HTMLInputElement>('#pull_request_title');
    const bodyEl = q<HTMLTextAreaElement>('#pull_request_body');
    if (titleEl) {
      titleEl.value = title;
    }

    if (bodyEl) {
      bodyEl.value = `## What
\n${title}\n
## Why
\n\n
## How
\n${description ? description : ''}\n
## Before
\n\n
## After
\n\n`;
    }
  }
};

export const setGithubAutofill = async () => {
  chrome.runtime.onMessage.addListener(async ({ type, value }) => {
    if (type !== GITHUB_AUTOFILL) {
      return;
    }

    if (q('body.is-pr-composer-expanded')) {
      await run(value);
      return;
    }

    // @ts-ignore
    document.arrive(
      'body.is-pr-composer-expanded',
      { fireOnAttributesModification: true },
      async () => {
        await run(value);
      }
    );
  });

  chrome.storage.local.onChanged.addListener(async (changes) => {
    const featureFlags = Object.keys(changes);
    if (featureFlags.includes(GITHUB_AUTOFILL)) {
      await run();
    }
  });
};

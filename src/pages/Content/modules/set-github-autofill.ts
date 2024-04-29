import 'arrive';

import {
  GITHUB_AUTOFILL,
  waitForElement,
  q,
  simulateClick,
  simulateType,
  GITHUB_AUTOFILL_SETTING,
} from '../lib';

const run = async () => {
  const results = await chrome.storage.local.get([GITHUB_AUTOFILL_SETTING]);
  const { reviewers, labels } = results[GITHUB_AUTOFILL_SETTING] || {
    reviewers: [],
    labels: [],
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
};

export const setGithubAutofill = async () => {
  chrome.runtime.onMessage.addListener(async ({ type }) => {
    if (type !== GITHUB_AUTOFILL) {
      return;
    }

    if (q('body.is-pr-composer-expanded')) {
      await run();
      return;
    }

    // @ts-ignore
    document.arrive(
      'body.is-pr-composer-expanded',
      { fireOnAttributesModification: true },
      async () => {
        await run();
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

import {
  makeIgnitionRequest,
  makeMissionControlRequest,
} from '../../../lib/graphql';
import './style.css';

const URI_REGEXP = /https:\/\/ignitionapp.atlassian.net\/browse\//;
const URI_REGEXP2 = /https:\/\/ignitionapp.atlassian.net\/jira\/servicedesk\//;
const DATA_ATTR = 'data-ignition-practice-reference-number';
const LINK_CLASSNAME = 'ignt-jira-mission-control-login-link';

const iconUrl = chrome.runtime.getURL('icon-34.png');

const renderContainer = (rootEl: HTMLElement, practiceId: string) => {
  console.log(`[DEBUG] renderContainer(rootEl, practiceId = ${practiceId})`);
  rootEl.style.position = 'relative';
  rootEl.setAttribute(DATA_ATTR, practiceId);

  const containerEl = document.createElement('div');
  containerEl.className = 'ignt-jira-mission-control-login';
  containerEl.style.top = `${rootEl.offsetHeight + 10}px`;
  containerEl.style.right = '5px';
  containerEl.innerHTML = [
    `<img class="ignt-jira-mission-control-login-logo" src="${iconUrl}" />`,
    `<a href="#" class="ignt-jira-mission-control-login-link disabled" ${DATA_ATTR}="#">Detecting...</a>`,
  ].join('&nbsp;');
  if (rootEl.parentNode) rootEl.parentNode.appendChild(containerEl);
  return containerEl;
};

const render = async () => {
  console.log('[DEBUG] render() is executed');
  const selectors = 'a[href^="https://go.ignitionapp.com/console/practice/"]';
  const targetEls = document.querySelectorAll(
    selectors
  ) as NodeListOf<HTMLElement>;

  if (!targetEls.length) {
    return;
  }

  targetEls.forEach((el) => {
    const practiceId = el
      .getAttribute('href')
      ?.replace('https://go.ignitionapp.com/console/practice/', '');

    if (!practiceId || !el || el.hasAttribute(DATA_ATTR)) {
      return;
    }
    const containerEl = renderContainer(el, practiceId);

    makeMissionControlRequest({
      query: `query practice($id: ID!) { practice(id: $id) { referenceNumber } }`,
      variables: { id: practiceId },
    })
      .then(({ practice }) => {
        const linkEl: HTMLLinkElement | null = containerEl.querySelector(
          `.${LINK_CLASSNAME}`
        );
        if (linkEl) {
          linkEl.dataset.ignitionPracticeReferenceNumber =
            practice.referenceNumber;
          const targetUrl = `https://go.ignitionapp.com/admin/sign_in_as_support/${practice.referenceNumber}`;
          linkEl.setAttribute('href', targetUrl);
          linkEl.innerHTML = 'Log in as the account';
          linkEl.classList.remove('disabled');
        }
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          console.error(error.message);
        }
      });

    // TODO: Check if the user is already logged in after it retrieves the reference number
  });
};

const bind = () => {
  console.log('[DEBUG] bind()');

  const checkLogin = async ({
    referenceNumber,
  }: {
    referenceNumber: string;
  }) => {
    console.log(
      `[DEBUG] checkLogin({ referenceNumber = "${referenceNumber}" })`
    );
    try {
      const { currentPractice } = await makeIgnitionRequest({
        query: `query { currentPractice { referenceNumber } }`,
        variables: {},
      });
      return currentPractice?.referenceNumber === referenceNumber;
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      }
    }
  };

  const handleClick = (e: MouseEvent) => {
    console.log('[DEBUG] handleClick()');
    const linkEl = e.target as HTMLLinkElement;
    if (!linkEl.matches('.ignt-jira-mission-control-login-link')) {
      return;
    }

    e.preventDefault();

    const targetUrl = linkEl.href;
    const settings = 'width=1,height=1,left=-1000,top=-1000';
    const newWindow = window.open(targetUrl, '_blank', settings);
    linkEl.innerHTML = 'Logging in...';
    linkEl.classList.add('disabled');

    if (!newWindow) {
      return;
    }

    setTimeout(async () => {
      newWindow.close();
      const referenceNumber = linkEl.getAttribute(DATA_ATTR);
      if (referenceNumber) {
        console.log('[DEBUG] handleClick(): referenceNumber', referenceNumber);
        const hasLogin = await checkLogin({ referenceNumber });
        console.log('[DEBUG] handleClick: hasLogin', hasLogin);
        if (hasLogin) {
          linkEl.innerHTML = `You've logged in`;
          linkEl.classList.add('disabled');
        }
      }
    }, 500);
  };

  document.body.addEventListener('click', handleClick);
};

const run = async () => {
  const url = window.location.href;
  const isMatchUrl = !!(url.match(URI_REGEXP) || url.match(URI_REGEXP2));
  if (isMatchUrl) {
    render();
    bind();
  }
};

export const setJiraMissionControlLogin = () => {
  window.addEventListener('popstate', run);
  window.addEventListener('beforeunload', () => {
    window.removeEventListener('popstate', run);
  });
  setTimeout(run, 1000);
};

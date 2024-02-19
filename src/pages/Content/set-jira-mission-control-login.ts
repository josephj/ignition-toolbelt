const URI_REGEXP = /https:\/\/ignitionapp.atlassian.net\/browse\//;
const URI_REGEXP2 = /https:\/\/ignitionapp.atlassian.net\/jira\/servicedesk\//;
const DATA_ATTR = 'data-ignition-practice-id';

export const setJiraMissionControlLogin = () => {
  const callback = () => {
    const isMatchUrl = !!(
      window.location.href.match(URI_REGEXP) ||
      window.location.href.match(URI_REGEXP2)
    );

    if (!isMatchUrl) {
      return;
    }

    const linkEls = document.querySelectorAll(
      'a[href^="https://go.ignitionapp.com/console/practice/prac_"]'
    ) as NodeListOf<HTMLElement>;

    linkEls.forEach((linkEl) => {
      const match = linkEl.getAttribute('href')?.match(/prac_[\w-]+/);
      if (match && linkEl && !linkEl.hasAttribute(DATA_ATTR)) {
        linkEl.setAttribute(DATA_ATTR, match[0]);
        linkEl.style.position = 'relative';

        const popoverEl = document.createElement('div');
        popoverEl.innerHTML = `<iframe src="https://go.ignitionapp.com/console/practice/prac_lu4q6l2lu5eaabaaoiva" allow="*"></iframe>`;
        linkEl.parentNode?.appendChild(popoverEl);

        linkEl.addEventListener('mouseenter', () => {
          popoverEl.style.display = 'block';
          popoverEl.style.top = `${-popoverEl.offsetHeight}`;
          popoverEl.style.right = '0';
        });
      }
    });
  };

  window.addEventListener('popstate', callback);
  window.addEventListener('beforeunload', () => {
    window.removeEventListener('popstate', callback);
  });

  setTimeout(callback, 3000);
};

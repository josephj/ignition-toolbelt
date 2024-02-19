const URI_REGEXP =
  /https:\/\/github.com\/ignitionapp\/Practice-Ignition\/pull\/\d+/;

export const setGithubTicketAutolink = () => {
  const callback = () => {
    const isMatchUrl = window.location.href.match(URI_REGEXP);
    if (!isMatchUrl) {
      return;
    }

    const ticketRegex = /(\b[A-Z]{1,10}-\d{1,6}\b)(?!([^<]+)?>)(?![\w-])/g;
    const matchEls = document.querySelectorAll(
      '.js-issue-title, .js-comment-body '
    ) as NodeListOf<HTMLElement>;

    if (!matchEls.length) {
      return;
    }

    matchEls.forEach((el) => {
      el.innerHTML = el.innerHTML.replace(
        ticketRegex,
        (match) =>
          `<a href="https://ignitionapp.atlassian.net/browse/${match}" target="_blank" title="${match}">${match}</a>`
      );
    });
  };

  document.addEventListener('turbo:load', callback);
  window.addEventListener('beforeunload', () => {
    window.removeEventListener('popstate', callback);
  });
  callback();
};

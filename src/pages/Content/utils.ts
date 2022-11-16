export const getElementByText = (
  textContent: string,
  querySelector: string = '*'
) => {
  return Array.from(document.querySelectorAll(querySelector)).find((el) => {
    return el.textContent === textContent;
  });
};

export const registerObserver = (
  callback = () => {},
  element: Node = document.body,
  options?: MutationObserverInit
) => {
  callback();

  const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      if (mutation.type === 'childList') {
        callback();
        break;
      }
    }
  });

  observer.observe(
    element,
    options || {
      attributes: true,
      childList: true,
      subtree: true,
    }
  );

  window.addEventListener('beforeunload', (e) => {
    observer.disconnect();
  });
};

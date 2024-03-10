export const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const waitUntil = (
  condition: () => boolean,
  interval = 100,
  duration = 5000
) =>
  new Promise<void>((resolve, reject) => {
    const intervalId = setInterval(() => {
      if (condition()) {
        clearInterval(intervalId);
        clearTimeout(timeoutId); // Clear the timeout as well
        resolve();
      }
    }, interval);

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      reject(new Error('Condition not met within timeout'));
    }, duration);
  });

export const waitForElement = (
  selector: string,
  interval: number = 500,
  timeout: number = 10000
) => {
  return new Promise<HTMLElement>((resolve, reject) => {
    const startTime = Date.now();
    const containsRegex = /:contains\((.*?)\)/;

    let containsText = '';
    if (containsRegex.test(selector)) {
      const matches = selector.match(containsRegex);
      if (matches) {
        containsText = matches[1].replace(/['"]/g, '');
        // Remove :contains() from the selector for querySelectorAll
        selector = selector.replace(containsRegex, '');
      }
    }

    const intervalId = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const elements = document.querySelectorAll<HTMLElement>(selector);
      const element = containsText
        ? Array.from(elements).find((el) =>
            el?.textContent?.includes(containsText)
          )
        : elements[0];

      if (element) {
        clearInterval(intervalId);
        resolve(element);
      } else if (elapsedTime >= timeout) {
        clearInterval(intervalId);
        reject(new Error('waitForElement timeout'));
      }
    }, interval);
  });
};

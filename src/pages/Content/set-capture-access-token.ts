const MESSAGE_TYPE = 'ACCESS_TOKEN';

export const setCaptureAccessToken = () => {
  if (window.location.pathname !== '/sign-in') {
    return;
  }

  const injectScript = () => {
    const scriptEl = document.createElement('script');
    scriptEl.src = chrome.runtime.getURL('injected.js');
    scriptEl.type = 'module';
    (document.head || document.documentElement).appendChild(scriptEl);
    scriptEl.onload = () => {
      window.postMessage({ type: 'ORIGIN', origin: window.location.href }, '*');
    };
  };

  setTimeout(() => {
    injectScript();
  }, 1000);

  const handleMessage = (event: MessageEvent) => {
    const { type, accessToken } = event.data;
    if (type === MESSAGE_TYPE) {
      chrome.runtime.sendMessage({ type, value: accessToken });
    }
  };

  window.addEventListener('message', handleMessage);
};

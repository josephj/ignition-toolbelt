(function () {
  const { fetch: originalFetch } = window;
  window.fetch = async (...args) => {
    const [resource, config] = args;
    if (resource === '/auth-api/graphql' && config.body.includes('userLogin')) {
      const response = await originalFetch(resource, config);
      const [
        {
          data: {
            userLogin: { accessToken },
          },
        },
      ] = await response.json();

      window.postMessage({ type: 'ACCESS_TOKEN', accessToken }, '*');

      window.location.href = '/';

      return originalFetch(resource, config);
    }
    return originalFetch(resource, config);
  };
})();

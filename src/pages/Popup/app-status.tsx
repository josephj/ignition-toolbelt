import React, { useEffect } from 'react';
import { useCodeVersionQuery } from '../../generated/hooks';

export const AppStatus = () => {
  const { error } = useCodeVersionQuery({
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  });

  useEffect(() => {
    if (error?.message === 'Unauthorized Request') {
      chrome.storage.local.set({ accessToken: '' });
    }
  }, [error]);

  return <div>App Status</div>;
};

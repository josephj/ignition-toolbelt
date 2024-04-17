import { useEffect } from 'react';
import { useCurrentPracticeQuery } from '@generated/ignition/hooks';
import { getEnvByUrl } from '../../Popup/utils';

export type AccountInfo = {
  id: string;
  countryCode: string;
  name?: string;
  referenceNumber?: string;
  env: string;
  loginUrl: string;
  lastAccessAt: number;
};

type Result = { [storageItem: string]: { [id: string]: AccountInfo } };

export const AppStatus = () => {
  const { data } = useCurrentPracticeQuery();

  const { id, countryCode, name, referenceNumber } =
    data?.currentPractice || {};

  useEffect(() => {
    if (!id) {
      return;
    }

    chrome.storage.local.get({ accounts: {} }, (result: Result) => {
      const url = window.location.href;
      const accounts = result.accounts;
      const { host, protocol } = new URL(url);
      const loginUrl = `${protocol}//${host}/admin/sign_in_as_support/${referenceNumber}`;
      const env = getEnvByUrl(url);
      if (env) {
        accounts[id] = {
          id,
          countryCode,
          name,
          referenceNumber,
          env,
          loginUrl,
          lastAccessAt: new Date().getTime(),
        };
        chrome.storage.local.set({ accounts });
      }
    });
  }, [id, countryCode, name, referenceNumber]);

  useEffect(() => {
    if (id) {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'get-current-practice-id') {
          sendResponse({ id: id });
        }
        return true;
      });
    }
  }, [id]);

  return null;
};

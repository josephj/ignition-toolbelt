import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { Popup } from './popup';
import { getHostUrl } from './utils';
import './index.css';

const containerEl = document.getElementById('app-container');
const root = createRoot(containerEl!);

(async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabUrl = tabs[0].url || '';
  const hostUrl = getHostUrl(tabUrl);

  root.render(
    <ChakraProvider>
      <Popup hostUrl={hostUrl} />
    </ChakraProvider>
  );
})();

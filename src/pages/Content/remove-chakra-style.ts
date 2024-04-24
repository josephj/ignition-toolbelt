import { useEffect } from 'react';

// Chakra injects global styles into the head of the document. This component
// removes those styles to prevent conflicts with the app.
export const RemoveChakraStyle = () => {
  useEffect(() => {
    const isChakraStyleTag = (tag: HTMLStyleElement) => {
      if (!tag.textContent) return false;

      return (
        tag.dataset.emotion === 'css-global' &&
        tag.textContent.includes(':root') &&
        tag.textContent.includes('--chakra-')
      );
    };

    const styleTags = document.querySelectorAll<HTMLStyleElement>(
      'style[data-emotion="css-global"]'
    );

    const chakraStyleTag = Array.from(styleTags).find(isChakraStyleTag);

    if (chakraStyleTag && chakraStyleTag.parentNode) {
      chakraStyleTag.parentNode?.removeChild(chakraStyleTag);
    }
  }, []);

  return null;
};

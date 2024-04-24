import { useEffect } from 'react';

// Chakra injects global styles into the head of the document. This component
// removes those styles to prevent conflicts with the app.
export const RemoveChakraStyle = () => {
  useEffect(() => {
    const styleSheets = Array.from(document.styleSheets).reverse();
    for (const styleSheet of styleSheets) {
      const ownerNode = styleSheet.ownerNode as HTMLStyleElement;
      if (
        !ownerNode ||
        !ownerNode.parentNode ||
        ownerNode.dataset.emotion !== 'css-global'
      ) {
        continue;
      }

      const hasChakraStyle = Array.from(styleSheet.cssRules).some(
        (cssRule) =>
          // @ts-ignore
          cssRule.selectorText &&
          // @ts-ignore
          cssRule.selectorText.includes(':host, :root, [data-theme]') &&
          /--chakra-/.test(cssRule.cssText)
      );

      if (hasChakraStyle) {
        ownerNode.parentNode.removeChild(ownerNode);
        break;
      }
    }
  }, []);

  return null;
};

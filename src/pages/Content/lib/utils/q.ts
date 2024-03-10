const REGEXP_CONTAINS = /:contains\((.*?)\)/;

export const q = <T extends Element>(
  selector: string,
  containerEl?: Element
): T | null => {
  const matches = selector.match(REGEXP_CONTAINS);
  const rootEl = containerEl || document;
  if (!matches) {
    return rootEl.querySelector<T>(selector);
  }

  const text = matches[1].replace(/['"]/g, '');
  const nextSelector = selector.replace(REGEXP_CONTAINS, '');
  const elements = rootEl.querySelectorAll<T>(nextSelector);
  const element = Array.from(elements).find((el) =>
    el?.textContent?.includes(text)
  );

  return element || null;
};

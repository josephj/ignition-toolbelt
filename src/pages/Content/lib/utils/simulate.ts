const dispatchKeyEvent = (inputElement: HTMLInputElement, key: string) => {
  const keyboardEvent = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
  });

  inputElement.dispatchEvent(keyboardEvent);
};

const selectAllText = (inputElement: HTMLInputElement) => {
  inputElement.select();

  const selectAllEvent = new KeyboardEvent('keydown', {
    key: 'a',
    ctrlKey: true, // Use `metaKey: true` on macOS
    bubbles: true,
  });

  inputElement.dispatchEvent(selectAllEvent);
};

const deleteText = (inputElement: HTMLInputElement) => {
  const deleteEvent = new KeyboardEvent('keydown', {
    key: 'Delete',
    bubbles: true,
  });
  inputElement.dispatchEvent(deleteEvent);

  if (
    inputElement.selectionStart !== null &&
    inputElement.selectionEnd !== null
  ) {
    const start = inputElement.selectionStart;
    const end = inputElement.selectionEnd;
    const text = inputElement.value;

    if (start !== end) {
      inputElement.value = text.slice(0, start) + text.slice(end);
      inputElement.setSelectionRange(start, start);
    } else if (start < text.length) {
      inputElement.value = text.slice(0, start) + text.slice(start + 1);
      inputElement.setSelectionRange(start, start);
    }
  } else {
    inputElement.value = inputElement.value.slice(0, -1);
  }

  const inputEvent = new Event('input', { bubbles: true });
  inputElement.dispatchEvent(inputEvent);
};

export const simulateType = (
  selectorOrElement: string | HTMLInputElement,
  text: string
) => {
  const inputElement =
    typeof selectorOrElement === 'string'
      ? (document.querySelector(selectorOrElement) as HTMLInputElement)
      : selectorOrElement;

  if (!inputElement) {
    console.error('Element not found');
    return;
  }

  inputElement.focus();
  const textParts = text.split(/(\{[^}]+})/).filter((part) => part !== '');
  for (const part of textParts) {
    if (part.startsWith('{') && part.endsWith('}')) {
      const specialKey = part.substring(1, part.length - 1).toLowerCase();
      switch (specialKey) {
        case 'esc':
          dispatchKeyEvent(inputElement, 'esc');
          break;
        case 'enter':
          dispatchKeyEvent(inputElement, 'enter');
          break;
        case 'selectall':
          selectAllText(inputElement);
          break;
        case 'del':
          deleteText(inputElement);
          break;
        default:
          console.warn(`Unrecognized special key: ${specialKey}`);
          break;
      }
    } else {
      inputElement.value += part;
      const inputEvent = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(inputEvent);
    }
  }

  const changeEvent = new Event('change', { bubbles: true });
  inputElement.dispatchEvent(changeEvent);
  inputElement.blur();
};

export const simulateClick = (buttonElement: Element) => {
  buttonElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
};

export const simulateSelect = (
  selector: string,
  optionValueOrLabel: string
) => {
  // Try to handle react-select first
  const reactSelectInput: HTMLInputElement | null = document.querySelector(
    `${selector} .react-select__control input`
  );
  if (reactSelectInput) {
    reactSelectInput.focus();
    reactSelectInput.value = optionValueOrLabel;

    const inputEvent = new Event('input', { bubbles: true });
    reactSelectInput.dispatchEvent(inputEvent);

    const keydownEvent = new KeyboardEvent('keydown', {
      bubbles: true,
    });
    reactSelectInput.dispatchEvent(keydownEvent);

    reactSelectInput.blur();
    return;
  }

  const nativeSelect: HTMLSelectElement | null =
    document.querySelector(selector);
  if (nativeSelect) {
    const optionToSelect: HTMLOptionElement | undefined = Array.from(
      nativeSelect.options
    ).find(
      (option) =>
        option.value === optionValueOrLabel ||
        option.textContent === optionValueOrLabel
    );

    if (optionToSelect) {
      nativeSelect.value = optionToSelect.value;

      const changeEvent = new Event('change', { bubbles: true });
      nativeSelect.dispatchEvent(changeEvent);
    } else {
      console.error('Option with value/label not found');
    }
  }
};

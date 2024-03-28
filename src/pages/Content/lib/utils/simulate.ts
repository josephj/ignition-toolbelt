export const simulateType = (inputElement: HTMLInputElement, text: string) => {
  inputElement.focus();
  inputElement.value = text;
  ['keydown', 'keyup'].forEach((eventType) => {
    const keyboardEvent = new KeyboardEvent(eventType, {key: text});
    inputElement.dispatchEvent(keyboardEvent);
  });
  const changeEvent = new Event('change', {bubbles: true});
  inputElement.dispatchEvent(changeEvent);
  inputElement.blur();
};

export const simulateClick = (buttonElement: Element) => {
  buttonElement.dispatchEvent(new MouseEvent('click', {bubbles: true}));
};

export const simulateSelect = (selector: string, optionValueOrLabel: string) => {
  // Try to handle react-select first
  const reactSelectInput: HTMLInputElement | null = document.querySelector(
    `${selector} .react-select__control input`
  );
  if (reactSelectInput) {
    reactSelectInput.focus();
    reactSelectInput.value = optionValueOrLabel;

    const inputEvent = new Event('input', {bubbles: true});
    reactSelectInput.dispatchEvent(inputEvent);

    const keydownEvent = new KeyboardEvent('keydown', {
      bubbles: true,
    });
    reactSelectInput.dispatchEvent(keydownEvent);

    reactSelectInput.blur();
    return;
  }

  const nativeSelect: HTMLSelectElement | null = document.querySelector(selector);
  if (nativeSelect) {
    const optionToSelect: HTMLOptionElement | undefined = Array.from(nativeSelect.options).find(
      (option) => option.value === optionValueOrLabel || option.textContent === optionValueOrLabel
    );

    if (optionToSelect) {
      nativeSelect.value = optionToSelect.value;

      const changeEvent = new Event('change', {bubbles: true});
      nativeSelect.dispatchEvent(changeEvent);
    } else {
      console.error('Option with value/label not found');
    }
  }
};

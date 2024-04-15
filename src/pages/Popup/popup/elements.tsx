import { components, OptionProps, SingleValueProps } from 'react-select';
import { SelectOption, SelectOptionGroup } from './types';
import { HStack, Link, Text } from '@chakra-ui/react';
import { countryCodeToFlagEmoji } from './utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import React, { MouseEventHandler } from 'react';

type FlagOptionProps = OptionProps<SelectOption, false, SelectOptionGroup> & {
  onRemoveOption: (id: string) => void;
};

export const FlagOption = (props: FlagOptionProps) => {
  const { id, countryCode } = props.data;
  const { onRemoveOption } = props;

  const handleRemove: MouseEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('=>(elements.tsx:21) id', id);
    onRemoveOption(id);
  };

  return (
    <components.Option {...props}>
      <HStack display="flex" spacing="5px" alignItems="flex-start">
        {countryCode ? (
          <Text fontSize="medium">{countryCodeToFlagEmoji(countryCode)}</Text>
        ) : null}
        <Text flex="1">{props.data.label}</Text>
        <Link colorScheme="blue" onClick={handleRemove}>
          <FontAwesomeIcon icon={faXmark} />
        </Link>
      </HStack>
    </components.Option>
  );
};

export const FlagSingleValue = (
  props: SingleValueProps<SelectOption, false, SelectOptionGroup>
) => {
  const { countryCode } = props.data;
  return (
    <components.SingleValue {...props}>
      <HStack spacing="5px">
        {countryCode ? (
          <Text fontSize="medium">{countryCodeToFlagEmoji(countryCode)}</Text>
        ) : null}
        <Text>{props.children}</Text>
      </HStack>
    </components.SingleValue>
  );
};

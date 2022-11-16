import { Badge, FormLabel, HStack, Switch, Text } from '@chakra-ui/react';
import React from 'react';
import {
  useAcknowledgementAddMutation,
  useAcknowledgementRemoveMutation,
  useAcknowledgementsQuery,
} from '../../../generated/hooks';
import { AcknowledgementLevel } from '../../../generated/types';

export const AcknowledgementList = () => {
  const { data, loading } = useAcknowledgementsQuery();
  const [acknowledgementRemove, { loading: isProcessingRemoveAck }] =
    useAcknowledgementRemoveMutation();
  const [acknowledgementAdd, { loading: isProcessingAddAck }] =
    useAcknowledgementAddMutation();

  if (loading || !data) return null;

  const { acknowledgements = [] } = data;

  const handleToggleAck = async (
    id: string,
    level: AcknowledgementLevel,
    checked: boolean
  ) => {
    if (!checked) {
      await acknowledgementRemove({ variables: { id, level } });
    } else {
      await acknowledgementAdd({ variables: { id, level } });
    }
  };

  return (
    <>
      {acknowledgements?.map(({ id, level }) => (
        <HStack key={id}>
          <Switch
            defaultChecked
            isDisabled={isProcessingRemoveAck || isProcessingAddAck}
            onChange={(e) => handleToggleAck(id, level, e.target.checked)}
            {...{ id }}
          />
          <FormLabel fontSize="12px" htmlFor={id}>
            <Text width="180px" isTruncated>
              {id}
            </Text>
          </FormLabel>
          <Badge
            colorScheme={
              level === AcknowledgementLevel.USER ? 'green' : 'yellow'
            }
            fontSize="10px"
            size="small"
            textTransform="lowercase"
          >
            {level}
          </Badge>
        </HStack>
      ))}
    </>
  );
};

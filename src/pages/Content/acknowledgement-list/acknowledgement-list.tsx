import {
  Badge,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Switch,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import {
  useAcknowledgementAddMutation,
  useAcknowledgementRemoveMutation,
  useAcknowledgementsQuery,
} from '@generated/ignition/hooks';
import { AcknowledgementLevel } from '@generated/ignition/types';

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
    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
      {acknowledgements?.map(({ id, level }) => (
        <GridItem
          borderRadius="md"
          borderColor="gray.200"
          borderStyle="solid"
          borderWidth="1px"
          padding="large"
          key={id}
        >
          <HStack display="flex" width="100%">
            <Switch
              size="lg"
              defaultChecked
              isDisabled={isProcessingRemoveAck || isProcessingAddAck}
              onChange={(e) => handleToggleAck(id, level, e.target.checked)}
              {...{ id }}
            />
            <FormLabel m={0} htmlFor={id} flex="1">
              <Text>{id}</Text>
            </FormLabel>
            <Badge
              colorScheme={
                level === AcknowledgementLevel.USER ? 'green' : 'yellow'
              }
              size="small"
              textTransform="lowercase"
            >
              {level}
            </Badge>
          </HStack>
        </GridItem>
      ))}
    </Grid>
  );
};

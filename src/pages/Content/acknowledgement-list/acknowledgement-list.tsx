import {
  Badge,
  FormLabel,
  Grid,
  GridItem,
  Link,
  HStack,
  Switch,
  Text,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import {
  useAcknowledgementAddMutation,
  useAcknowledgementRemoveMutation,
  useAcknowledgementsQuery,
} from '@generated/ignition/hooks';
import {
  Acknowledgement,
  AcknowledgementLevel,
} from '@generated/ignition/types';

const ACCESSED_ACKNOWLEDGEMENTS_LOG = 'accessed_acknowledgements';

export const AcknowledgementList = () => {
  const {data, loading, refetch} = useAcknowledgementsQuery();
  const [acks, setAcks] = useState<Acknowledgement[]>([]);
  const [acknowledgementRemove, {loading: isProcessingRemoveAck}] =
    useAcknowledgementRemoveMutation();
  const [acknowledgementAdd, {loading: isProcessingAddAck}] =
    useAcknowledgementAddMutation();

  useEffect(() => {
    if (!data) {
      return;
    }
    const {acknowledgements = []} = data;

    chrome.storage.local.get([ACCESSED_ACKNOWLEDGEMENTS_LOG], (result) => {
      const savedAcks = result[ACCESSED_ACKNOWLEDGEMENTS_LOG] || [];
      const newAcks = acknowledgements.filter(
        ({id}) => !savedAcks.some((ack: Acknowledgement) => (ack.id === id))
      );
      if (newAcks.length) {
        const nextAcks = [...savedAcks, ...newAcks];
        setAcks(nextAcks);
        chrome.storage.local.set({
          [ACCESSED_ACKNOWLEDGEMENTS_LOG]: nextAcks,
        });
      } else {
        setAcks(savedAcks);
      }
    });
  }, [data]);

  if (loading || !data) return null;

  const handleToggleAck = async (
    id: string,
    level: AcknowledgementLevel,
    checked: boolean
  ) => {
    if (!checked) {
      await acknowledgementRemove({variables: {id, level}});
    } else {
      await acknowledgementAdd({variables: {id, level}});
    }
    await refetch();
  };

  const handleRemove = async (id: string) => {
    const results = await chrome.storage.local.get([
      ACCESSED_ACKNOWLEDGEMENTS_LOG,
    ]);
    const prevAcks = results[ACCESSED_ACKNOWLEDGEMENTS_LOG] || [];
    const nextAcks = prevAcks.filter((ack: Acknowledgement) => ack.id !== id);

    await chrome.storage.local.set({
      [ACCESSED_ACKNOWLEDGEMENTS_LOG]: nextAcks,
    });

    setAcks(nextAcks);
  };

  const acknowledgements = acks
    .map(({id, ...rest}) => {
      const matched = data.acknowledgements.find((ack) => ack.id === id);
      return {
        id,
        ...rest,
        updatedAt: matched?.updatedAt || null,
        isEnabled: !!matched,
      };
    })
    .sort((a, b) => (a.id > b.id ? 1 : -1));

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
      {acknowledgements?.map(({id, isEnabled, level, updatedAt}) => (
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
              defaultChecked={isEnabled}
              isDisabled={isProcessingRemoveAck || isProcessingAddAck}
              onChange={(e) => handleToggleAck(id, level, e.target.checked)}
              {...{id}}
            />
            <FormLabel m={0} htmlFor={id} flex="1">
              <Text>{id}</Text>
              {updatedAt ? (
                <Text fontSize="sm" color="gray.500">
                  {updatedAt}
                </Text>
              ) : null}
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
            <Link colorScheme="blue" onClick={() => handleRemove(id)}>
              <FontAwesomeIcon icon={faXmark}/>
            </Link>
          </HStack>
        </GridItem>
      ))}
    </Grid>
  );
};

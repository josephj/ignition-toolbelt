import {
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

export const MissionControl = ({
  url,
  name,
  isOpen,
  onClose,
}: {
  url?: string;
  name?: string;
  isOpen: boolean;
  onClose(): void;
}) => {
  // const { data, loading } = useCurrentPracticeQuery();
  //
  // if (!data || loading) {
  //   return null;
  // }
  //
  // const { currentPractice } = data;

  // const urlScheme = new URL(window.location.href);
  // const url = `${urlScheme.protocol}//${urlScheme.host}/console/practice/${currentPractice?.id}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="8xl">
      <ModalOverlay />
      <ModalContent width="1400px">
        <ModalHeader>
          <HStack spacing="large">
            <Text>{name}</Text>
            <Link colorScheme="blue" href={url} isExternal>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </Link>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="xlarge">
          <iframe
            title="frame"
            src={url}
            width="100%"
            height="800px"
            frameBorder={0}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

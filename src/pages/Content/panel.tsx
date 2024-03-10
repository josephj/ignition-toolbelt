import React from 'react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useAcknowledgementsQuery } from '../../generated/ignition/hooks';

export const Panel = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose(): void;
}) => {
  const { data, loading } = useAcknowledgementsQuery();

  if (loading) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Hello world</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{JSON.stringify(data)}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

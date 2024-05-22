import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';
import { AcknowledgementList } from '../acknowledgement-list';

export const AcknowledgementModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose(): void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Acknowledgements</ModalHeader>
        <ModalCloseButton />
        <ModalBody paddingX="xxlarge" paddingY="large" minHeight="500px">
          <AcknowledgementList />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

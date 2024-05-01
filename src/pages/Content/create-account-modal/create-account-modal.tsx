import React from 'react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { CreateNewAccount } from '../create-new-account';

export const CreateAccountModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose(): void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new account</ModalHeader>
        <ModalCloseButton />
        <ModalBody paddingX="xxlarge" paddingY="large">
          <CreateNewAccount />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

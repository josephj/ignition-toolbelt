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
  useBoolean,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

type Props = {
  url?: string;
  name?: string;
  isOpen: boolean;
  onClose(): void;
};

export const GraphiqlModal = ({ url, name, isOpen, onClose }: Props) => {
  const [isRendered, setRendered] = useBoolean();

  useEffect(() => {
    if (url && name && isOpen && !isRendered) {
      setRendered.on();
    }
  }, [isOpen, isRendered, name, setRendered, url]);

  if (!url || !isRendered) {
    return null;
  }

  return (
    <Modal isCentered isOpen={true} onClose={onClose} size="8xl">
      {isOpen ? <ModalOverlay /> : null}
      <ModalContent
        maxWidth="95%"
        width="1400px"
        sx={
          !isOpen
            ? {
                top: '-1000em',
                right: 'unset',
                left: '-1000em',
                bottom: 'unset',
              }
            : undefined
        }
      >
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

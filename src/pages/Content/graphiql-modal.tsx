import {
  Flex,
  HStack,
  Link,
  Modal,
  ModalBody,
  CloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useBoolean,
  useOutsideClick,
} from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
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
  const [isVisible, setVisibility] = useBoolean();
  const ref = useRef<HTMLElement>(null);

  useOutsideClick({
    ref: ref,
    handler: () => {
      setVisibility.off();
      onClose();
    },
  });

  useEffect(() => {
    if (url && name && isOpen && !isRendered) {
      setRendered.on();
      setVisibility.on();
    }
  }, [isOpen, isRendered, name, setRendered, setVisibility, url]);

  useEffect(() => {
    if (!isRendered) {
      return;
    }
    if (isOpen) {
      setVisibility.on();
    } else {
      setVisibility.off();
    }
  }, [isOpen, isRendered, isVisible, setVisibility]);

  if (!url || !isRendered) {
    return null;
  }

  const handleClickClose: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setVisibility.off();
    onClose();
  };

  const handleOriginalClose = () => {
    // doing nothing
  };

  return (
    <Modal
      isCentered
      isOpen
      closeOnEsc={false}
      closeOnOverlayClick={false}
      onClose={handleOriginalClose}
      size="8xl"
      trapFocus={isVisible}
    >
      {isVisible ? <ModalOverlay /> : null}
      <ModalContent
        maxWidth="95%"
        ref={ref}
        width="1400px"
        sx={
          !isVisible
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
          <Flex justifyContent="space-between">
            <HStack spacing="large">
              <Text>{name}</Text>
              <Link colorScheme="blue" href={url} isExternal>
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </Link>
            </HStack>
            <CloseButton onClick={handleClickClose} />
          </Flex>
        </ModalHeader>
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

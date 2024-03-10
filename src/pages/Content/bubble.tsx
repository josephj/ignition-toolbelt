import {
  Flex,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';

const iconUrl = chrome.runtime.getURL('icon-128.png');

export const Bubble = ({ onClick }: { onClick(): void }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);

  useEffect(() => {
    // Load the position from chrome.storage.local when the component mounts
    chrome.storage.local.get(['bubblePosition'], (result) => {
      const { x = 0, bottom = '50' } = result.bubblePosition || {};
      const initialPosition = {
        x,
        y: window.innerHeight - (bottom + 50),
      };
      setPosition(initialPosition);
    });
  }, []);

  const handleStop = async (e, data) => {
    const { x, y, node } = data;
    console.log('=>(bubble.tsx:36) data', data);
    const nextPosition = {
      x,
      bottom: window.innerHeight - (y + node.offsetHeight),
    };
    console.log('=>(bubble.tsx:40) y', y);
    console.log('=>(bubble.tsx:40) node.offsetHeight', node.offsetHeight);
    console.log('=>(bubble.tsx:40) window.innerHeight', window.innerHeight);
    setPosition({ x, y });
    await chrome.storage.local.set({ bubblePosition: nextPosition });
    console.log('=>(bubble.tsx:42) nextPosition', nextPosition);
  };

  return (
    <Popover placement="top-start" trigger="hover">
      <PopoverTrigger>
        <Draggable position={position} onStop={handleStop}>
          <Flex
            alignItems="center"
            backgroundColor="gray.200"
            borderRadius="50%"
            boxShadow="0 1px 5px rgba(0, 0, 0, 0.3)"
            // display="inline-flex"
            display="none"
            fontSize="14px"
            height="50px"
            justifyContent="center"
            // onClick={onClick}
            opacity="0.5"
            padding="10px"
            position="absolute"
            ref={dragRef}
            transition="opacity 1s, background-color 1s"
            width="50px"
            zIndex="9999"
            _hover={{
              backgroundColor: 'gray.500',
              opacity: '1',
            }}
          >
            <Image src={iconUrl} width="18px" height="18px" draggable={false} />
          </Flex>
        </Draggable>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>Popover body</PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

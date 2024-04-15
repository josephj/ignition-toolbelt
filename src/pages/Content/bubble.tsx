import {
  HStack,
  Flex,
  Image,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuButton,
  Text,
} from '@chakra-ui/react';
import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { useCurrentPracticeQuery } from '../../generated/ignition/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFlag,
  faGear,
  faScrewdriverWrench,
  faWandMagicSparkles,
  faTerminal,
} from '@fortawesome/free-solid-svg-icons';
import { getEnvByUrl } from '../Popup/utils';

const iconUrl = chrome.runtime.getURL('icon-128.png');

const countryCodeToFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const Bubble = ({
  onMissionControlClick,
  onPanelClick,
  onAcknowledgementClick,
  onClickCreateNewAccount,
}: {
  onMissionControlClick(url: string, name: string): void;
  onPanelClick(): void;
  onAcknowledgementClick(): void;
  onClickCreateNewAccount(): void;
}) => {
  const { data, loading } = useCurrentPracticeQuery();
  const [position] = useState({ x: 50, y: -100 });
  const dragRef = useRef(null);

  if (!data || loading) {
    return null;
  }

  const {
    currentPractice: { id, name, countryCode },
  } = data || {};

  const isDevelopmentEnv = getEnvByUrl(window.location.href) === 'development';

  const handleClickMissionControl = (e: React.MouseEvent) => {
    const url = `${window.location.origin}/console/practice/${id}`;
    if (e.metaKey) {
      window.open(url);
    } else {
      onMissionControlClick(url, 'Mission control');
    }
  };

  const handleClickGraphiql = (e: React.MouseEvent) => {
    const url = `${window.location.origin}/graphiql`;
    if (e.metaKey) {
      window.open(url);
    } else {
      onMissionControlClick(url, 'GraphiQL');
    }
  };

  return (
    <Draggable position={position} /* onStop={handleStop}*/>
      <Flex
        alignItems="center"
        data-testid="ignition-toolbelt-bubble"
        backgroundColor="gray.200"
        borderRadius="50%"
        boxShadow="0 1px 5px rgba(0, 0, 0, 0.3)"
        display="inline-flex"
        height="50px"
        justifyContent="center"
        opacity="0.5"
        position="fixed"
        ref={dragRef}
        transition="opacity 1s, background-color 1s"
        width="50px"
        zIndex="655350"
        _hover={{
          backgroundColor: 'gray.500',
          opacity: '1',
        }}
      >
        <Menu arrowPadding={16}>
          <MenuButton padding="10px">
            <Image src={iconUrl} width="18px" height="18px" draggable={false} />
          </MenuButton>
          <MenuList>
            <HStack px="small" spacing="small">
              <Text fontSize="large" fontWeight="medium">
                {countryCodeToFlagEmoji(countryCode)}
              </Text>
              <Text color="brand">{name}</Text>
            </HStack>
            <MenuDivider />
            <MenuItem
              icon={<FontAwesomeIcon icon={faScrewdriverWrench} />}
              onClick={handleClickMissionControl}
            >
              Mission Control
            </MenuItem>
            <MenuItem
              icon={<FontAwesomeIcon icon={faFlag} />}
              onClick={onAcknowledgementClick}
            >
              Acknowledgements
            </MenuItem>
            <MenuItem
              icon={<FontAwesomeIcon icon={faTerminal} />}
              onClick={handleClickGraphiql}
            >
              GraphiQL
            </MenuItem>
            {isDevelopmentEnv ? (
              <MenuItem
                icon={<FontAwesomeIcon icon={faWandMagicSparkles} />}
                onClick={onClickCreateNewAccount}
              >
                Create new account
              </MenuItem>
            ) : null}
            <MenuItem
              icon={<FontAwesomeIcon icon={faGear} />}
              onClick={onPanelClick}
            >
              Settings
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Draggable>
  );
};

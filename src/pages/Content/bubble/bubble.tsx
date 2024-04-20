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
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpRightFromSquare,
  faFlag,
  faGear,
  faScrewdriverWrench,
  faWandMagicSparkles,
  faTerminal,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import { faStripeS } from '@fortawesome/free-brands-svg-icons';

import { useCurrentPracticeQuery } from '@generated/ignition/hooks';

import { getEnvByUrl } from '../../Popup/utils';
import { Header } from './header';
import { useConsolePractice } from './use-console-practice';
import { AboutModal } from './about-modal';

const isDevelopmentEnv = getEnvByUrl(window.location.href) === 'development';
const iconUrl = chrome.runtime.getURL('icon-128.png');

export const Bubble = ({
  csrfToken,
  onMissionControlClick,
  onPanelClick,
  onAcknowledgementClick,
  onClickCreateNewAccount,
}: {
  csrfToken: string;
  onMissionControlClick(url: string, name: string): void;
  onPanelClick(): void;
  onAcknowledgementClick(): void;
  onClickCreateNewAccount(): void;
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [position] = useState({ x: 50, y: -100 });
  const dragRef = useRef(null);

  const { data } = useCurrentPracticeQuery();
  const { id } = data?.currentPractice || {};
  const { data: consolePracticeData } = useConsolePractice({ id, csrfToken });
  const stripeDashboardUri =
    consolePracticeData?.practice.stripeIntegrationAccount?.dashboardUri;

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
    <>
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
              <Image
                src={iconUrl}
                width="18px"
                height="18px"
                draggable={false}
              />
            </MenuButton>
            <MenuList>
              <Header csrfToken={csrfToken} />
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
              {stripeDashboardUri ? (
                <MenuItem
                  as="a"
                  href={stripeDashboardUri}
                  target="_blank"
                  // @ts-ignore
                  icon={<FontAwesomeIcon icon={faStripeS} />}
                >
                  <HStack>
                    <Text>Stripe dashboard</Text>
                    <Text as="span" fontSize="xsmall">
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    </Text>
                  </HStack>
                </MenuItem>
              ) : null}
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
              <MenuItem
                icon={<FontAwesomeIcon icon={faCircleInfo} />}
                onClick={onOpen}
              >
                About
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Draggable>
      <AboutModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

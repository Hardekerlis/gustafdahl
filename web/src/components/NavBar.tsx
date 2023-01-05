import { ChevronDownIcon, SettingsIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/layout';
import {
  Button,
  Flex,
  Img,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorModeValue,
} from '@chakra-ui/react';
import { useCurrentUserQuery, useLogoutMutation } from 'generated/graphql';
import NextLink from 'next/link';
import React from 'react';
import { disableSSR } from 'utils/disableSSR';
import { isServer } from 'utils/isServer';
import { DarkModeSwitch } from './DarkModeSwitch';

interface NavBarProps {
  children?: React.ReactNode;
}

export const NavBar: React.FC<NavBarProps> = disableSSR(({}) => {
  const [, logout] = useLogoutMutation();
  const [{ data, fetching }] = useCurrentUserQuery({
    pause: isServer(), // Wont make request on server
  });

  let body = null;

  if (fetching) {
    // Data is loading
  } else if (!data?.currentUser) {
    // User not logged in
    body = (
      <>
        <Link as={NextLink} href={'/login'} mr={2}>
          login
        </Link>
        <Link as={NextLink} href={'/register'}>
          register
        </Link>
      </>
    );
  } else {
    // User is logged in
    body = (
      <Flex>
        <Menu isLazy>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            textTransform={'capitalize'}
          >
            {data.currentUser.username}
          </MenuButton>
          <MenuList zIndex={1000}>
            <Link as={NextLink} href='/settings'>
              <MenuItem>
                <Box float='left'>Settings</Box>
                <Box position='absolute' right='20px'>
                  <SettingsIcon />
                </Box>
              </MenuItem>
            </Link>
            <MenuDivider />
            <MenuItem
              onClick={() => {
                // @ts-ignore
                logout(); // Not to sure why this is complaning it doesnt need any params. Works though
              }}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    );
  }

  const bgColor = useColorModeValue('teal.200', 'teal');
  return (
    <Flex position='fixed' top={0} left={0} right={0} bgColor={bgColor} p={4}>
      <Link as={NextLink} href='/'>
        <Img src='/' alt='home' />
      </Link>

      <Box mr='10' ml='10'>
        <Link as={NextLink} href='/about'>
          About
        </Link>
      </Box>

      <Box>
        <Link as={NextLink} href='/blog'>
          Blog
        </Link>
      </Box>

      <Flex ml={'auto'}>
        <Flex alignItems='center' mr={5}>
          {body}
        </Flex>
        <Box>
          <DarkModeSwitch />
        </Box>
      </Flex>
    </Flex>
  );
});

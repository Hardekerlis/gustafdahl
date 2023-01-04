import { Button, GridItem, useColorModeValue } from '@chakra-ui/react';
import { SettingsNav } from 'components/settings/nav';
import { SettingsLayoutProps } from 'constants/SettingsLayoutProps';
import { useIsAuth } from 'hooks/useIsAuth';
import { GridLayout } from 'layouts/grid';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { createUrqlClient } from 'utils/createUrqlClient';

interface SecurityProps {
  children?: React.ReactNode;
}

const Security: React.FC<SecurityProps> = ({}) => {
  const buttonColor = useColorModeValue('white', 'gray.600');
  const { fetching, user } = useIsAuth();

  return (
    <GridLayout loading={!fetching && !user} {...SettingsLayoutProps}>
      <SettingsNav />
      <GridItem colSpan={1} rowSpan={1} colEnd={6}>
        <Button bgColor={buttonColor} float={'right'}>
          Change Password
        </Button>
      </GridItem>
      <GridItem colSpan={4} rowSpan={1}></GridItem>
      <GridItem colSpan={4} rowSpan={1}></GridItem>
      <GridItem colSpan={4} rowSpan={1}></GridItem>
      <GridItem colSpan={4} rowSpan={1}></GridItem>
    </GridLayout>
  );
};

export default withUrqlClient(createUrqlClient)(Security);

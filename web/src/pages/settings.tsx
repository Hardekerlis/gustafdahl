import { GridItem } from '@chakra-ui/react';
import { SettingsNav } from 'components/settings/nav';
import { SettingsLayoutProps } from 'constants/SettingsLayoutProps';
import { useIsAuth } from 'hooks/useIsAuth';
import { GridLayout } from 'layouts/grid';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { createUrqlClient } from 'utils/createUrqlClient';
import { redirectToLoginIfNotAuthenticated } from 'utils/redirectToLoginIfNotAuthenticated';

export const getServerSideProps = async (ctx: NextContext) => {
  return await redirectToLoginIfNotAuthenticated(ctx);
};

const Settings: React.FC<{}> = ({}) => {
  const { fetching, user } = useIsAuth();

  return (
    <GridLayout loading={fetching && !user} {...SettingsLayoutProps}>
      <SettingsNav />
      <GridItem colSpan={2} rowSpan={1}></GridItem>
      <GridItem colSpan={2}></GridItem>
      <GridItem colSpan={4}></GridItem>
    </GridLayout>
  );
};

export default withUrqlClient(createUrqlClient)(Settings);

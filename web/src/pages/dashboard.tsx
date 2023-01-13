import { useDisclosure } from '@chakra-ui/react';
import { NavBar } from 'components/NavBar';
import { useIsAuth } from 'hooks/useIsAuth';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { createUrqlClient } from 'utils/createUrqlClient';

interface DashboardProps {
  children?: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({}) => {
  useIsAuth();

  return (
    <>
      <NavBar />
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Dashboard);

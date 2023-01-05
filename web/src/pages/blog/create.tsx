import { Box } from '@chakra-ui/react';
import { useIsAuth } from 'hooks/useIsAuth';
import { DefaultLayout } from 'layouts/default';
import { withUrqlClient } from 'next-urql';
import dynamic from 'next/dynamic';
import React from 'react';
import { createUrqlClient } from 'utils/createUrqlClient';
import { getCurrentUserServerSide } from 'utils/getCurrentUserServerSide';
const Editor = dynamic(() => import('utils/editorInitialize'), { ssr: false });

export const getServerSideProps = async (ctx: NextContext) => {
  const user = await getCurrentUserServerSide(ctx);

  if (!user || !user.isAdmin) {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
};

const Create: React.FC<{}> = ({}) => {
  useIsAuth();

  return (
    <DefaultLayout>
      <Box bgColor='white' color='black' height='100%'>
        <Editor />
      </Box>
    </DefaultLayout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Create);

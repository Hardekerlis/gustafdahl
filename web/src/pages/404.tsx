import { Box, Flex, Heading, Link, Text } from '@chakra-ui/react';
import { DefaultLayout } from 'layouts/default';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import React from 'react';
import { createUrqlClient } from 'utils/createUrqlClient';

const NotFound: React.FC<{}> = ({}) => {
  return (
    <DefaultLayout>
      <Flex
        justifyContent='center'
        alignItems='center'
        height='100%'
        width='100%'
      >
        <Box>
          <Heading as='h2' size='2xl'>
            Whoops! We couldn't locate the requested resource
          </Heading>
          <Text fontSize='3xl'>404 error</Text> <Box></Box>
          <Box mt={10}>
            <Link as={NextLink} href='/'>
              Go to home page
            </Link>
          </Box>
        </Box>
      </Flex>
    </DefaultLayout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(NotFound);

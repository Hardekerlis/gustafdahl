import { SmallAddIcon } from '@chakra-ui/icons';
import { Button, Flex, Heading, Link, Tooltip } from '@chakra-ui/react';
import { useCurrentUserQuery } from 'generated/graphql';
import { DefaultLayout } from 'layouts/default';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import React from 'react';
import { createUrqlClient } from 'utils/createUrqlClient';

// export const getServerSideProps = async (ctx: NextContext) => {
//   const user = await getCurrentUserServerSide(ctx);

//   let isAdmin = false;

//   if (user && user.isAdmin) isAdmin = !isAdmin;

//   return {
//     props: {
//       isAdmin: isAdmin,
//     },
//   };
// };

// interface BlogProps {
//   isAdmin: boolean;
// }

const Blog: React.FC<{}> = ({}) => {
  const [{ data }] = useCurrentUserQuery();

  return (
    <DefaultLayout>
      <Flex>
        <Heading as='h4' size='md' mb={5}>
          Posts
        </Heading>
        {data && data?.currentUser && data.currentUser.isAdmin ? (
          <Tooltip label='Create blog post'>
            <Link as={NextLink} href='/blog/create' ml='auto'>
              <Button>
                <SmallAddIcon />
              </Button>
            </Link>
          </Tooltip>
        ) : (
          <></>
        )}
      </Flex>
    </DefaultLayout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Blog);

import { DefaultLayout } from 'layouts/default';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { createUrqlClient } from 'utils/createUrqlClient';

export const getServerSideProps = () => {
  return {
    notFound: true,
  };
};

const BlogPost: React.FC<{}> = ({}) => {
  const router = useRouter();

  return <DefaultLayout>{router.query.postId}</DefaultLayout>;
};

export default withUrqlClient(createUrqlClient, { ssr: false })(BlogPost);

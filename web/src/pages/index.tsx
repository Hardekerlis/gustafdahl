import { DefaultLayout } from 'layouts/default';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from 'utils/createUrqlClient';

const Index = () => (
  <DefaultLayout variant='small'>
    <div>Hello World</div>
  </DefaultLayout>
);

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);

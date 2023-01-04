import { initUrqlClient } from 'next-urql';
import { Client, dedupExchange, fetchExchange, ssrExchange } from 'urql';

export const getServerUrqlClient = (ctx?: NextContext): Client => {
  const ssrCache = ssrExchange({ isClient: false });
  const client = initUrqlClient(
    {
      url: 'http://localhost:4000/graphql',
      fetchOptions: {
        credentials: 'include',
        headers: {
          cookie: ctx && ctx.req.headers.cookie ? ctx.req.headers.cookie : '',
        },
      },
      exchanges: [dedupExchange, ssrCache, fetchExchange],
    },
    false,
  );

  if (!client) throw new Error('Failed to create Urql client');

  return client;
};

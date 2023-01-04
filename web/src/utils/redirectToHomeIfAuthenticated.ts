import { IncomingMessage } from 'http';
import { NextUrqlContext } from 'next-urql';
import { getCurrentUserServerSide } from './getCurrentUserServerSide';

declare global {
  type NextContext = NextUrqlContext & {
    req: IncomingMessage;
    resolvedUrl: string;
  };
}

export const redirectToHomeIfAuthenticated = async (ctx: NextContext) => {
  const currentUser = await getCurrentUserServerSide(ctx);

  if (currentUser) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  return {
    props: {},
  };
};

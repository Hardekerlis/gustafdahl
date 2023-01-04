import { getCurrentUserServerSide } from './getCurrentUserServerSide';

export const redirectToLoginIfNotAuthenticated = async (ctx: NextContext) => {
  const currentUser = await getCurrentUserServerSide(ctx);
  const destination = `/login/?next=${ctx.resolvedUrl}`;

  if (!currentUser) {
    return {
      redirect: {
        permanent: false,
        destination,
      },
    };
  }

  return {
    props: {},
  };
};

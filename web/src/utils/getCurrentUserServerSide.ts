import { CurrentUserDocument } from 'generated/graphql';
import { OperationResult } from 'urql';
import { getServerUrqlClient } from './getServerUrqlClient';

export const getCurrentUserServerSide = async (ctx: NextContext) => {
  const client = getServerUrqlClient(ctx);

  const { data } = (await client
    ?.query(CurrentUserDocument.loc?.source?.body as string, {})
    .toPromise()) as OperationResult;

  if (!data) return null;

  return data.currentUser;
};

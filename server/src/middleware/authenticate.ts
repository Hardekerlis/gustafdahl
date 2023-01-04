import { MyContext } from 'lib';
import { MiddlewareFn } from 'type-graphql';

export const authenticateMiddleware: MiddlewareFn<MyContext> = async (
  { context: { req } },
  next,
) => {
  if (!req.session.userId) {
    throw new Error('not authenticated');
  }

  return await next();
};

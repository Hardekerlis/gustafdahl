import Logger, { ColorsEnum } from 'frictionless-logger';
import { MiddlewareFn } from 'type-graphql';

const logger = new Logger({
  message: {
    static: {
      text: 'Execution Time',
      color: ColorsEnum.Cyan,
    },
  },
});

export const executionTimeMiddleware = (message: string): MiddlewareFn => {
  const _executionTimeMiddleware: MiddlewareFn = async (_, next) => {
    const start = +new Date();
    const result = await next();

    const resolveTime = +new Date() - start;

    logger.info(`${message} took ${resolveTime} ms`);

    return result;
  };

  return _executionTimeMiddleware;
};

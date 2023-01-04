import { UserModel } from 'entities';
import Logger from 'frictionless-logger';
import { MiddlewareFn } from 'type-graphql';
import validator from 'validator';
import { UserResponse } from './base-classes';

const logger = new Logger({
  message: {
    static: {
      text: 'Get User',
    },
  },
});

export const getUser = async (id: string): Promise<UserResponse> => {
  logger.info(`Attempting to fetch user with id ${id}`);
  const user = await UserModel.findById(id);

  if (!user) {
    logger.debug(`Couldn't find user with id ${id}`);
    return {
      user: null,
    };
  }

  logger.debug('Found user. Returning to user');
  return {
    user,
  };
};

export const ValidateGetUserId: MiddlewareFn = async (
  { args: { id } },
  next,
) => {
  logger.debug(`Validating MongoId ${id}`);
  if (!validator.isMongoId(id)) {
    logger.debug('Invalid MongoId');
    return {
      errors: [
        {
          field: 'id',
          message: 'Invalid id',
        },
      ],
    };
  }

  return await next();
};

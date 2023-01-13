import { FORGET_PASSWORD_PREFIX } from 'constants/forgot-password-prefix';
import { UserModel } from 'entities';
import Logger from 'frictionless-logger';
import { RedisClient } from 'lib';
import { passwordValidator } from 'lib/validators/passwordValidator';
import { Field, InputType, MiddlewareFn } from 'type-graphql';
import { FieldError } from '../../lib/base-classes';

const logger = new Logger({
  message: {
    static: {
      text: 'Change password',
    },
  },
});

@InputType()
export class ChangePasswordInput {
  @Field()
  token: string;

  @Field()
  newPassword: string;

  @Field()
  confirmNewPassword: string;
}

export const changePassword = async (
  data: ChangePasswordInput,
  redis: RedisClient,
) => {
  const key = `${FORGET_PASSWORD_PREFIX} ${data.token}`;
  logger.debug('Getting key from Redis');
  const userId = await redis.get(key);

  if (!userId) {
    logger.debug('No key found');
    return {
      errors: [
        {
          field: 'token',
          message: 'token expired',
        },
      ],
    };
  }

  logger.debug('Getting user from db');
  const user = await UserModel.findById(userId);

  if (!user) {
    logger.debug('No user found');
    return {
      errors: [
        {
          field: 'token',
          message: 'user no longer exists',
        },
      ],
    };
  }

  logger.debug('Updating and saving password');
  user.password = data.newPassword;
  await user.save();

  logger.debug('Deleting redis key');
  await redis.del(key);

  return {
    user,
  };
};

export const ValidateChangePasswordData: MiddlewareFn = async (
  { args: { data } },
  next,
) => {
  let errors: FieldError[] = [];

  const passwordErrors = passwordValidator(
    data.newPassword,
    data.confirmNewPassword,
    logger,
    {
      confirmPasswordName: 'confirmNewPassword',
      passwordName: 'newPassword',
    },
  );

  errors = errors.concat(passwordErrors);

  if (errors[0])
    return {
      errors,
    };

  return await next();
};

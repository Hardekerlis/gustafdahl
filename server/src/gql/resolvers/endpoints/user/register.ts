import { UserModel } from 'entities';
import { Request } from 'express';
import Logger from 'frictionless-logger';
import { config } from 'lib';
import { passwordValidator } from 'lib/validators/passwordValidator';
import { Field, InputType, MiddlewareFn } from 'type-graphql';
import validator from 'validator';
import { FieldError, UserResponse } from './base-classes';

const logger = new Logger({
  message: {
    static: {
      text: 'Registration',
    },
  },
});

@InputType()
export class UserRegisterInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  confirmPassword: string;
}

export const register = async (
  data: UserRegisterInput,
  req: Request,
): Promise<UserResponse> => {
  logger.info('Building user');

  const user = UserModel.build({
    email: data.email,
    password: data.password,
    username: data.username.toLowerCase(),
  });

  logger.debug('Saving user to MongoDB');
  await user.save();

  req.session.userId = user.id;

  return {
    user,
  };
};

export const ValidateRegisterData: MiddlewareFn = async (
  { args: { data } },
  next,
) => {
  let errors: FieldError[] = [];

  logger.debug(`Validating username ${data.username}`);
  if (
    !validator.isLength(data.username.toLowerCase(), {
      min: config.username.minLength,
      max: config.username.maxLength,
    }) ||
    !validator.isAlphanumeric(data.username.toLowerCase(), 'sv-SE')
  ) {
    logger.debug('Username verification failed');
    errors.push({
      field: 'username',
      message: `Username must be a minimum of ${config.username.minLength} characters and a maximum of ${config.username.maxLength} and can only include letters and numbers`,
    });
  }

  logger.debug(`Validating email ${data.email}`);
  if (!validator.isEmail(data.email)) {
    logger.debug('Email verification failed');
    errors.push({
      field: 'email',
      message: 'The email is invalid',
    });
  }

  const passwordErrors = passwordValidator(
    data.password,
    data.confirmPassword,
    logger,
  );

  errors = errors.concat(passwordErrors);

  logger.debug(`Checking if email ${data.email} is taken`);
  const user = await UserModel.findOne({ email: data.email });
  if (user) {
    logger.debug('Email already taken');
    errors.push({
      field: 'email',
      message: 'Email already taken',
    });
  }

  logger.debug(`Checking if username ${data.username} is taken`);
  const isUsernameTaken = await UserModel.findOne({
    username: data.username.toLowerCase(),
  });
  if (isUsernameTaken) {
    logger.debug('Username is already taken');
    errors.push({
      field: 'username',
      message: 'Username is already taken',
    });
  }

  if (errors[0])
    return {
      errors,
    };

  logger.info('Registering user');

  return await next();
};
